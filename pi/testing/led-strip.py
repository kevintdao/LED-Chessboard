import time
from rpi_ws281x import *

# LED strip configuration:
LED_COUNT = 64
LED_PIN = 18
LED_BRIGHTNESS = 65

strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, brightness=LED_BRIGHTNESS)

strip.begin()


def colorWipe(strip: Adafruit_NeoPixel, color: Color, wait_ms=50):
  for i in range(strip.numPixels()):
    strip.setPixelColor(i, color)
    strip.show()
    time.sleep(wait_ms / 1000.0)


while True:
  colorWipe(strip, Color(255, 0, 0))
  colorWipe(strip, Color(0, 255, 0))
  colorWipe(strip, Color(0, 0, 255))
