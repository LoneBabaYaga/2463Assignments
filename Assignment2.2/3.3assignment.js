// P5.js code to toggle an LED and receive analog values

let serial; // variable to hold an instance of the serialport library
let portName = '/dev/cu.usbmodem1411'; // fill in your serial port name here

function setup() {
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing

  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port
}

function draw() {
  // You can create a UI here
}

// Get the list of ports:
function printList(portList) {
 // portList is an array of serial port names
 for (let i = 0; i < portList.length; i++) {
  // Display the list the console:
  print(i + " " + portList[i]);
 }
}

// Following functions are for serial communication
function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.')
}

function serialEvent() {
  let inString = serial.readStringUntil('\r\n');
  if (inString.length > 0) {
    let sensors = split(trim(inString), ','); // If you are sending multiple values, split them
    if (sensors.length > 1) {
      let analogValue = sensors[1]; // Assuming second value is the analog value
      // Now use this analog value to change the background or something
      background(map(analogValue, 0, 1023, 0, 255)); // This maps the analog value
    }
  }
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}

// Toggle LED when mouse is pressed
function mousePressed() {
  serial.write('H'); // Send a byte to turn the LED on
}

// Toggle LED when mouse is released
function mouseReleased() {
  serial.write('L'); // Send a byte to turn the LED off
}