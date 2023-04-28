#include <Adafruit_NeoPixel.h>

/* How many shift register chips are daisy-chained.*/
#define NUMBER_OF_SHIFT_CHIPS 4

/* Width of data (how many ext lines).*/
#define DATA_WIDTH NUMBER_OF_SHIFT_CHIPS * 8

/* Width of pulse to trigger the shift register to read and latch.*/
#define PULSE_WIDTH_USEC 5

/* Optional delay between shift register reads.*/
#define POLL_DELAY_MSEC 1

// Which pin on the Arduino is connected to the NeoPixels?
// On a Trinket or Gemma we suggest changing this to 1:
#define LED_PIN 8

// 1st 4 shift registers pins
#define LOAD_PIN 7     // parallel load pin of 165
#define CLOCK_PIN 6    // clock pin of 165
#define DATA_PIN 5     // Q7 pin of 165
#define CLOCK_EN_PIN 4 // clock enable pin of 165

// 2nd 4 shift registers pins
#define LOAD_PIN_B 12    // parallel load pin of 165
#define CLOCK_PIN_B 11   // clock pin of 165
#define DATA_PIN_B 10    // Q7 pin of 165
#define CLOCK_EN_PIN_B 9 // clock enable pin of 165

// How many NeoPixels are attached to the Arduino?
#define LED_COUNT 64

/* You will need to change the "int" to "long" If the
 * NUMBER_OF_SHIFT_CHIPS is higher than 2.
 */
// int       = 16 bits
// long      = 32 bits
// long long = 64 bits
#define BYTES_VAL_T unsigned long

BYTES_VAL_T pinValues1;
BYTES_VAL_T pinValues2;
BYTES_VAL_T oldPinValues1;
BYTES_VAL_T oldPinValues2;

String command;
String strs[20];
int prevMoves[2] = {64, 64};
int StringCount = 0;

// Declare our NeoPixel strip object:
Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

/* This function is essentially a "shift-in" routine reading the
 * serial Data from the shift register chips and representing
 * the state of those pins in an unsigned integer (or long).
 */
BYTES_VAL_T read_shift_regs()
{
  long bitVal;
  BYTES_VAL_T bytesVal = 0;

  /* Trigger a parallel Load to latch the state of the data lines */
  digitalWrite(CLOCK_EN_PIN, HIGH);
  digitalWrite(LOAD_PIN, LOW);
  delayMicroseconds(PULSE_WIDTH_USEC);
  digitalWrite(LOAD_PIN, HIGH);
  digitalWrite(CLOCK_EN_PIN, LOW);

  /* Loop to read each bit value from the serial out line
   * of the SN74HC165N.
   */
  for (int i = 0; i < DATA_WIDTH; i++)
  {
    bitVal = digitalRead(DATA_PIN);

    /* Set the corresponding bit in bytesVal.*/
    bytesVal |= (bitVal << ((DATA_WIDTH - 1) - i));

    /* Pulse the Clock (rising edge shifts the next bit) */
    digitalWrite(CLOCK_PIN, HIGH);
    delayMicroseconds(PULSE_WIDTH_USEC);
    digitalWrite(CLOCK_PIN, LOW);
  }

  return (bytesVal);
}

BYTES_VAL_T read_shift_regs_b()
{
  long bitVal;
  BYTES_VAL_T bytesVal = 0;

  /* Trigger a parallel Load to latch the state of the data lines */
  digitalWrite(CLOCK_EN_PIN_B, HIGH);
  digitalWrite(LOAD_PIN_B, LOW);
  delayMicroseconds(PULSE_WIDTH_USEC);
  digitalWrite(LOAD_PIN_B, HIGH);
  digitalWrite(CLOCK_EN_PIN_B, LOW);

  // Loop to read each bit value from the serial out line of the SN74HC165N.
  for (int i = 0; i < DATA_WIDTH; i++)
  {
    bitVal = digitalRead(DATA_PIN_B);

    /* Set the corresponding bit in bytesVal.*/
    bytesVal |= (bitVal << ((DATA_WIDTH - 1) - i));

    /* Pulse the Clock (rising edge shifts the next bit) */
    digitalWrite(CLOCK_PIN_B, HIGH);
    delayMicroseconds(PULSE_WIDTH_USEC);
    digitalWrite(CLOCK_PIN_B, LOW);
  }

  return (bytesVal);
}

/* Dump the list of zones along with their current status.*/
void display_pin_values()
{
  // Serial.print("Pin States:\r\n");

  // first 32 pins
  for (int i = 0; i < DATA_WIDTH; i++)
  {
    // Serial.print("  Pin-");
    // Serial.print(i);
    // Serial.print(": ");
    bool currPinValue = bitRead(pinValues1, i);
    bool oldPinValue = bitRead(oldPinValues1, i);

    if (currPinValue != oldPinValue)
    {
      // picked up
      if (currPinValue)
      {
        Serial.println("up " + String(i));
        // Serial.print("HIGH");
        // strip.setPixelColor(i, strip.Color(0, 0, 0));
      }
      // put down
      else
      {
        Serial.println("down " + String(i));
        // Serial.print("LOW");
        // strip.setPixelColor(i, strip.Color(255, 0, 0));
      }
      // Serial.print("\r\n");
    }
  }

  // second 32 pins
  for (int i = 0; i < DATA_WIDTH; i++)
  {
    // Serial.print("  Pin-");
    // Serial.print(i + 32);
    // Serial.print(": ");
    bool currPinValue = bitRead(pinValues2, i);
    bool oldPinValue = bitRead(oldPinValues2, i);

    if (currPinValue != oldPinValue)
    {
      // picked up
      if (currPinValue)
      {
        Serial.println("up " + String(i + 32));
        // Serial.print("HIGH");
        // strip.setPixelColor(i + 32, strip.Color(0, 0, 0));
      }
      // put down
      else
      {
        Serial.println("down " + String(i + 32));
        // Serial.print("LOW");
        // strip.setPixelColor(i + 32, strip.Color(255, 0, 0));
      }
    }
    // Serial.print("\r\n");
  }

  // Serial.print("\r\n");
  strip.show();
}

void displayLeds()
{
  strip.clear();
  strip.show();

  String c = strs[0];
  for (int i = 1; i < StringCount; i++)
  {
    if (c == "LM")
    {
      strip.setPixelColor(strs[i].toInt(), strip.Color(0, 255, 0));
    }
    else if (c == "PM")
    {
      prevMoves[i - 1] = strs[i].toInt();
      strip.setPixelColor(strs[i].toInt(), strip.Color(255, 255, 0));
    }
  }
  strip.show();
}

void displayPreviousMove(int prevMoves[])
{
  // always display previous moves leds
  for (int i = 0; i < 2; i++)
  {
    strip.setPixelColor(prevMoves[i], strip.Color(255, 255, 0));
  }

  strip.show();
}

void get_pin_change(BYTES_VAL_T pinValues, BYTES_VAL_T oldPinValues)
{
  Serial.println("Change:");
  for (int i = 0; i < DATA_WIDTH; i++)
  {
    bool currPinValue = bitRead(pinValues, i);
    bool oldPinValue = bitRead(oldPinValues, i);

    if (currPinValue != oldPinValue)
    {
      Serial.println("PU " + String(i));
    }
  }
}

void setup()
{
  Serial.begin(9600);

  /* Initialize our digital pins... */
  pinMode(LOAD_PIN, OUTPUT);
  pinMode(CLOCK_EN_PIN, OUTPUT);
  pinMode(CLOCK_PIN, OUTPUT);
  pinMode(DATA_PIN, INPUT);

  pinMode(LOAD_PIN_B, OUTPUT);
  pinMode(CLOCK_EN_PIN_B, OUTPUT);
  pinMode(CLOCK_PIN_B, OUTPUT);
  pinMode(DATA_PIN_B, INPUT);

  digitalWrite(CLOCK_PIN, LOW);
  digitalWrite(CLOCK_PIN_B, LOW);
  digitalWrite(LOAD_PIN, HIGH);
  digitalWrite(LOAD_PIN_B, HIGH);

  /* Read in and display the pin states at startup */
  pinValues1 = read_shift_regs();
  pinValues2 = read_shift_regs_b();

  // display_pin_values();
  oldPinValues1 = pinValues1;
  oldPinValues2 = pinValues2;

  strip.begin();           // INITIALIZE NeoPixel strip object (REQUIRED)
  strip.show();            // Turn OFF all pixels ASAP
  strip.setBrightness(75); // Set BRIGHTNESS to about 1/5 (max = 255)
}

void loop()
{
  /* Read the state of all zones.*/
  pinValues1 = read_shift_regs();

  // read the state of the second shift register
  pinValues2 = read_shift_regs_b();

  /* If there was a chage in state, display which ones changed */
  if (pinValues1 != oldPinValues1 || pinValues2 != oldPinValues2)
  {
    // Serial.print("*Pin value change detected*\r\n");
    display_pin_values();
    oldPinValues1 = pinValues1;
    oldPinValues2 = pinValues2;
  }

  delay(POLL_DELAY_MSEC);

  if (Serial.available())
  {
    command = Serial.readStringUntil("\n");
    command.trim();

    // Split the string into substrings
    StringCount = 0;
    while (command.length() > 0)
    {
      int index = command.indexOf(' ');
      if (index == -1) // No space found
      {
        strs[StringCount++] = command;
        break;
      }
      else
      {
        strs[StringCount++] = command.substring(0, index);
        command = command.substring(index + 1);
      }
    }
  }

  // delay(100);
  displayLeds();
  // displayPreviousMove(prevMoves);
}