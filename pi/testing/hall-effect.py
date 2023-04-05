import RPi.GPIO as GPIO
import time

# simple program to read from hall effect sensor
sensor = 14

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(sensor, GPIO.IN)

while True:
  print(GPIO.input(sensor))
  time.sleep(1)
