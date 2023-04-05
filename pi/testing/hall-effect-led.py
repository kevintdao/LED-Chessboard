import RPi.GPIO as GPIO
import time
from rpi_ws281x import *

LED_MAPPING = {
    23: 0,
    24: 1,
    25: 2
}

# simple program to read from hall effect sensor
SENSOR = 23

# LED strip configuration:
LED_COUNT = 64
LED_PIN = 18
LED_BRIGHTNESS = 65

BLACK = Color(0, 0, 0)
RED = Color(255, 0, 0)

strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, brightness=LED_BRIGHTNESS)

strip.begin()

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(23, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(24, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(25, GPIO.IN, pull_up_down=GPIO.PUD_UP)

while True:
  # print(GPIO.input(SENSOR))
  if GPIO.input(23):
    strip.setPixelColor(0, BLACK)
  else:
    strip.setPixelColor(0, RED)

  if GPIO.input(24):
    strip.setPixelColor(1, BLACK)
  else:
    strip.setPixelColor(1, RED)

  if GPIO.input(25):
    strip.setPixelColor(2, BLACK)
  else:
    strip.setPixelColor(2, RED)
  strip.show()
