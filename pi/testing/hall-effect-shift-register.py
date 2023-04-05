import RPi.GPIO as GPIO
import time

# simple program to read from hall effect sensor
SENSOR = 23

# shift register pins
PIN_DATA = 12
PIN_LOAD = 21
PIN_CLOCK = 20
PIN_CLOCK_EN = 16

pulse_time = .000005     # 5 microseconds

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(PIN_DATA, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(PIN_LOAD, GPIO.OUT)
GPIO.setup(PIN_CLOCK, GPIO.OUT)
GPIO.setup(PIN_CLOCK_EN, GPIO.OUT)

data = [0, 0, 0, 0, 0, 0, 0, 0]
while True:
  # get data
  GPIO.output(PIN_LOAD, GPIO.LOW)
  time.sleep(pulse_time)
  GPIO.output(PIN_LOAD, GPIO.HIGH)

  for i in range(8):
    bit = GPIO.input(PIN_DATA)
    data[i] = bit

    # Pulse the clock: rising edge shifts the next bit.
    GPIO.output(PIN_CLOCK, GPIO.HIGH)
    time.sleep(pulse_time)
    GPIO.output(PIN_CLOCK, GPIO.LOW)
    # time.sleep(pulse_time)

  print(data)

  time.sleep(1)
