#!/usr/bin/env python3
import serial
import chess
import re
from firebase import db

board = chess.Board()
# board.set_fen(
#     "r1bqkbnr/ppp2ppp/2np4/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 2 4")
picked_up = []
prev_move = []


LED_MAPPING = {
    "a8": 56, "b8": 57, "c8": 58, "d8": 59, "e8": 60, "f8": 61, "g8": 62, "h8": 63,
    "a7": 55, "b7": 54, "c7": 53, "d7": 52, "e7": 51, "f7": 50, "g7": 49, "h7": 48,
    "a6": 40, "b6": 41, "c6": 42, "d6": 43, "e6": 44, "f6": 45, "g6": 46, "h6": 47,
    "a5": 39, "b5": 38, "c5": 37, "d5": 36, "e5": 35, "f5": 34, "g5": 33, "h5": 32,
    "a4": 24, "b4": 25, "c4": 26, "d4": 27, "e4": 28, "f4": 29, "g4": 30, "h4": 31,
    "a3": 23, "b3": 22, "c3": 21, "d3": 20, "e3": 19, "f3": 18, "g3": 17, "h3": 16,
    "a2":  8, "b2":  9, "c2": 10, "d2": 11, "e2": 12, "f2": 13, "g2": 14, "h2": 15,
    "a1":  7, "b1":  6, "c1":  5, "d1":  4, "e1":  3, "f1":  2, "g1":  1, "h1":  0
}


def move_listener(message):
  data = message['data']

  print(data)

  if data is None or 'from' not in data or 'to' not in data:
    return

  # get the move
  from_square = data['from']
  to_square = data['to']

  # convert move into chess
  move = chess.Move.from_uci(from_square + to_square)
  try:
    board.push(move)  # Make the move
  except:
    print('error')

  print('Move:', move)
  print(board)

  prev_move = [from_square, to_square]
  led = "PM "
  led += " ".join([str(LED_MAPPING[move])
                  for move in prev_move]) + "\n"

  # display move
  res = led.encode('utf-8')
  ser.write(res)


def turn_listener(message):
  data = message['data']
  print('Turn:', data)


def fen_listener(message):
  data = message['data']
  board.set_fen(data)


def add_move(from_square: str, to_square: str):
  # add move to firebase
  db.child('moves').push({
      'from': from_square,
      'to': to_square
  })

  # make move on board
  move = chess.Move.from_uci(from_square + to_square)
  board.push(move)

  # update turn
  turn = 'w' if board.turn else 'b'
  db.child('turn').set(turn)

  prev_move = [from_square, to_square]
  led = "PM "
  led += " ".join([str(LED_MAPPING[move])
                  for move in prev_move]) + "\n"

  # display move
  res = led.encode('utf-8')
  ser.write(res)


def get_all_legal_moves(board: chess.Board) -> dict:
  moves = {}

  # convert all legal moves into a list
  legal_moves = list(board.legal_moves)

  # add all legal moves to the dictionary
  for move in legal_moves:
    [fromSquare, toSquare] = re.findall(r'\w{2}', move.uci())

    # if the fromSquare is not in the dictionary, add it
    if fromSquare not in moves:
      moves[fromSquare] = []

    moves[fromSquare].append(toSquare)

  return moves


def get_pin_mapping(input_pin: int) -> int:
  row = input_pin // 8 + 1

  # even row
  if row % 2 == 0:
    return input_pin
  else:
    return row * 8 - (input_pin % 8 + 1)


if __name__ == '__main__':
  # initialize serial
  ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
  ser.reset_input_buffer()

  move_stream = db.child("moves").stream(move_listener)

  # fen_stream = db.child('fen').stream(fen_listener)

  while True:
    moves = get_all_legal_moves(board)
    print("Previous Move: ", prev_move)

    if ser.in_waiting > 0:
      line = ser.readline().decode('utf-8').rstrip()

      # piece is picked up
      if line.startswith('up'):
        pin = get_pin_mapping(int(line.split(' ')[1]))

        print(f'Pin {pin} is picked up')

        # get the square from pin
        square = [k for k, v in LED_MAPPING.items() if v == pin][0]

        # add pin to picked_up array if not in it
        if pin not in picked_up:
          picked_up.append(pin)

        # check if pin picked up in in legal moves (piece is being taken)
        if len(picked_up) == 2:
          # remove the pin from picked up
          from_square = [k for k, v in LED_MAPPING.items() if v ==
                         picked_up[0]][0]
          if pin in moves[from_square]:
            picked_up.remove(pin)
            continue

          # a piece is picked up (display legal moves led)
        if len(picked_up) == 1:
          # check if square in moves
          if square not in moves:
            continue

          # check if square is in the previous move
          if square in prev_move:
            # clear previous move
            prev_move = []
            continue

          # led to light up
          led = "LM "
          led += " ".join([str(LED_MAPPING[move])
                          for move in moves[square]]) + "\n"

          # send led of legal moves to arduino
          res = led.encode('utf-8')
          ser.write(res)
          print(res)

        # a piece is put back (clear leds)
        if len(picked_up) == 0:
          res = "\n".encode('utf-8')
          ser.write(res)

      # piece is put down
      if line.startswith('down'):
        pin = get_pin_mapping(int(line.split(' ')[1]))

        print(f'Pin {pin} is put down')

        # get the square from pin
        square = [k for k, v in LED_MAPPING.items() if v == pin][0]

        # check if square is in the previous move
        if square in prev_move:
          continue

        # check if pin is in picked up (the same piece is put down)
        if pin in picked_up:
          picked_up.remove(pin)

        # check if pin is not in picked up (piece is moved to difference square)
        if len(picked_up) != 0 and pin not in picked_up:
          # convert pins into square
          from_square = [k for k, v in LED_MAPPING.items() if v ==
                         picked_up[0]][0]
          to_square = [k for k, v in LED_MAPPING.items() if v == pin][0]

          # check if move is legal
          if to_square not in moves[from_square]:
            print('Illegal move')
            print(picked_up)

          # call add move function
          print(
              f'Move from {picked_up[0]} ({from_square}) to {pin} ({to_square})')
          add_move(from_square, to_square)

          # clear picked up
          picked_up = []

        res = "\n".encode('utf-8')
        ser.write(res)

  # turn_stream = db.child('turn').stream(turn_listener)
