#!/usr/bin/env python3
import serial
import chess
from firebase import db

board = chess.Board()


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


if __name__ == '__main__':
  # ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
  # ser.reset_input_buffer()
  # while True:
  #   if ser.in_waiting > 0:
  #     line = ser.readline().decode('utf-8').rstrip()
  #     print(line)
  print(board)
  move_stream = db.child("moves").stream(move_listener)
  turn_stream = db.child('turn').stream(turn_listener)
