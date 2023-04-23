#!/usr/bin/env python3
import serial
import chess
import re
import time
from firebase import db

board = chess.Board()
# board.set_fen("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 1")
picked_up = ['1']
move_set = [['e2', 'e4']]


LED_MAPPING = {
    "a8": "56", "b8": "57", "c8": "58", "d8": "59", "e8": "60", "f8": "61", "g8": "62", "h8": "63",
    "a7": "55", "b7": "54", "c7": "53", "d7": "52", "e7": "51", "f7": "50", "g7": "49", "h7": "48",
    "a6": "40", "b6": "41", "c6": "42", "d6": "43", "e6": "44", "f6": "45", "g6": "46", "h6": "47",
    "a5": "39", "b5": "38", "c5": "37", "d5": "36", "e5": "35", "f5": "34", "g5": "33", "h5": "32",
    "a4": "24", "b4": "25", "c4": "26", "d4": "27", "e4": "28", "f4": "29", "g4": "30", "h4": "31",
    "a3": "23", "b3": "22", "c3": "21", "d3": "20", "e3": "19", "f3": "18", "g3": "17", "h3": "16",
    "a2":  "8", "b2":  "9", "c2": "10", "d2": "11", "e2": "12", "f2": "13", "g2": "14", "h2": "15",
    "a1":  "7", "b1":  "6", "c1":  "5", "d1":  "4", "e1":  "3", "f1":  "2", "g1":  "1", "h1":  "0"
}


def move_listener(message):
  data = message['data']

  if data is None or 'from' not in data or 'to' not in data:
    return

  # get the move
  moveFrom = data['from']
  moveTo = data['to']

  # convert move into chess
  move = chess.Move.from_uci(moveFrom + moveTo)
  board.push(move)  # Make the move

  print('Move:', move)
  print(board)


def turn_listener(message):
  data = message['data']
  print('Turn:', data)


def add_move(fromSquare: str, toSquare: str):
  # add move to firebase
  db.child('moves').push({
      'from': fromSquare,
      'to': toSquare
  })

  # make move on board
  move = chess.Move.from_uci(fromSquare + toSquare)
  board.push(move)

  # update turn
  turn = 'w' if board.turn else 'b'
  db.child('turn').set(turn)


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


if __name__ == '__main__':
  # initialize serial
  ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
  ser.reset_input_buffer()

  while True:
    moves = get_all_legal_moves(board)
    # led = " ".join([LED_MAPPING[move] for move in moves['e2']]) + "\n"
    # res = led.encode('utf-8')
    # print(res)
    # ser.write(res)
    # time.sleep(2)

    # led = " ".join([LED_MAPPING[move] for move in moves['g1']]) + "\n"
    # res = led.encode('utf-8')
    # print(res)
    # ser.write(res)
    # time.sleep(2)

    # add_move('e2', 'e4')
    # time.sleep(10)
    # add_move('g1', 'f3')
    # time.sleep(10)

    if ser.in_waiting > 0:
      line = ser.readline().decode('utf-8').rstrip()

      if (line.startswith('PU')):
        pin = line.split(' ')[1]

        # add pin to picked_up array if not in it
        if pin not in picked_up:
          picked_up.append(pin)
        else:
          picked_up.remove(pin)

        print(picked_up)
        # check if pin picked up in in legal moves (piece is being taken)
        if len(picked_up) == 2:
          # remove the pin from picked up
          pass
        #   picked_up.remove(pin)

        # a piece is picked up (display legal moves led)
        if len(picked_up) == 1:
          # get the square from pin
          square = [k for k, v in LED_MAPPING.items() if v == pin][0]

          # led to light up
          led = " ".join([LED_MAPPING[move] for move in moves[square]]) + "\n"

          # send response to arduino
          res = led.encode('utf-8')
          ser.write(res)
          print(res)

        # a piece is put back (clear leds)
        if len(picked_up) == 0:
          res = "\n".encode('utf-8')
          ser.write(res)

  move_stream = db.child("moves").stream(move_listener)
  turn_stream = db.child('turn').stream(turn_listener)
