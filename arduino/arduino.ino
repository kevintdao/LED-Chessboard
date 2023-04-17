#include <Adafruit_NeoPixel.h>

/* How many shift register chips are daisy-chained.*/
#define NUMBER_OF_SHIFT_CHIPS   2

/* Width of data (how many ext lines).*/
#define DATA_WIDTH   NUMBER_OF_SHIFT_CHIPS * 8

/* Width of pulse to trigger the shift register to read and latch.*/
#define PULSE_WIDTH_USEC   5

/* Optional delay between shift register reads.*/
#define POLL_DELAY_MSEC   1

// Which pin on the Arduino is connected to the NeoPixels?
// On a Trinket or Gemma we suggest changing this to 1:
#define LED_PIN      8

// shift registers pins
#define LOAD_PIN     7  // parallel load pin of 165
#define CLOCK_PIN    6  // clock enable pin of 165
#define DATA_PIN     5  // Q7 pin of 165
#define CLOCK_EN_PIN 4  // clock pin of 165

// How many NeoPixels are attached to the Arduino?
#define LED_COUNT  64

/* You will need to change the "int" to "long" If the
 * NUMBER_OF_SHIFT_CHIPS is higher than 2.
*/
#define BYTES_VAL_T unsigned int

BYTES_VAL_T pinValues;
BYTES_VAL_T oldPinValues;

// chessboard mapping
#define string[] CHESS_MAPPING = [
    ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"],
    ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
    ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
    ["a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5"],
    ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4"],
    ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
    ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
    ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]
];

// led mapping
#define int[] LED_MAPPING = [
    [56, 57, 58, 59, 60, 61, 62, 63],
    [55, 54, 53, 52, 51, 50, 49, 48],
    [40, 41, 42, 43, 44, 45, 46, 47],
    [39, 38, 37, 36, 35, 34, 33, 32],
    [24, 25, 26, 27, 28, 29, 30, 31],
    [23, 22, 21, 20, 19, 18, 17, 16],
    [ 8,  9, 10, 11, 12, 13, 14, 15],
    [ 7,  6,  5,  4,  3,  2,  1,  0]
];

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
    for(int i = 0; i < DATA_WIDTH; i++)
    {
        bitVal = digitalRead(DATA_PIN);

        /* Set the corresponding bit in bytesVal.*/
        bytesVal |= (bitVal << ((DATA_WIDTH-1) - i));

        /* Pulse the Clock (rising edge shifts the next bit) */
        digitalWrite(CLOCK_PIN, HIGH);
        delayMicroseconds(PULSE_WIDTH_USEC);
        digitalWrite(CLOCK_PIN, LOW);
    }

    return(bytesVal);
}

/* Dump the list of zones along with their current status.*/
void display_pin_values()
{
    Serial.print("Pin States:\r\n");

    for(int i = 0; i < DATA_WIDTH; i++)
    {
        Serial.print("  Pin-");
        Serial.print(i);
        Serial.print(": ");

        if((pinValues >> i) & 1) {
          Serial.print("HIGH");
          strip.setPixelColor(i, strip.Color(0, 0, 0));

        }
        else {
          Serial.print("LOW");
          strip.setPixelColor(i, strip.Color(255, 0, 0));
        }

        Serial.print("\r\n");
    }

    Serial.print("\r\n");
    strip.show();
}

void setup()
{
    Serial.begin(9600);

    /* Initialize our digital pins... */
    pinMode(LOAD_PIN, OUTPUT);
    pinMode(CLOCK_EN_PIN, OUTPUT);
    pinMode(CLOCK_PIN, OUTPUT);
    pinMode(DATA_PIN, INPUT);

    digitalWrite(CLOCK_PIN, LOW);
    digitalWrite(LOAD_PIN, HIGH);

    /* Read in and display the pin states at startup */
    pinValues = read_shift_regs();
    display_pin_values();
    oldPinValues = pinValues;

    strip.begin();           // INITIALIZE NeoPixel strip object (REQUIRED)
    strip.show();            // Turn OFF all pixels ASAP
    strip.setBrightness(50); // Set BRIGHTNESS to about 1/5 (max = 255)
}

void loop()
{
    /* Read the state of all zones.
    */
    pinValues = read_shift_regs();

    /* If there was a chage in state, display which ones changed */
    if(pinValues != oldPinValues)
    {
        Serial.print("*Pin value change detected*\r\n");
        display_pin_values();
        oldPinValues = pinValues;
    }

    delay(POLL_DELAY_MSEC);
}
