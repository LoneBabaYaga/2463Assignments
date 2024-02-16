let characters = [];
let spriteSheet; // Assume this is your sprite sheet for a character

function preload() {
  // Load your sprite sheets here
  spriteSheet = loadImage('path/to/spriteSheet.png');
}

function setup() {
  createCanvas(800, 600);
  // Initialize your characters here
  for (let i = 0; i < 3; i++) { // Example for 3 characters
    characters.push(new Character(random(width), random(height), spriteSheet));
  }
}

function draw() {
  background(255);
  // Update and display your characters here
  for (let char of characters) {
    char.update();
    char.display();
  }
}

function keyPressed() {
  // Handle left and right arrow keys
  if (keyCode === RIGHT_ARROW) {
    // Move characters right
    for (let char of characters) {
      char.moveRight();
    }
  } else if (keyCode === LEFT_ARROW) {
    // Move characters left
    for (let char of characters) {
      char.moveLeft();
    }
  }
}


// create characters
let characters = [];

// Load sprite sheets
let spriteSheet1;
let spriteSheet2;
let spriteSheet3;

function preload() {
  spriteSheet1 = loadImage('NinjaSprite.png');
  spriteSheet2 = loadImage('RobotSprite.png');
  spriteSheet3 = loadImage('VikingSprite.png');
}

function setup() {
  createCanvas(1300, 650);


  for (let i = 0; i < 3; i++) {
    characters.push(new Character(spriteSheet1, random(width), random(height)));
    characters.push(new Character(spriteSheet2, random(width), random(height)));
    characters.push(new Character(spriteSheet3, random(width), random(height)));
  }

// Character class
class Character {
  constructor(x, y, spriteSheet) {
    this.x = x;
    this.y = y;
    this.spriteSheet = spriteSheet;
    // Add more properties as needed for animation
  }

  update() {
    // Update character state and animation frame
  }

  display() {
    // Draw character based on current state and frame
  }

  moveRight() {
    // Move character right
  }

  moveLeft() {
    // Move character left using scale() to flip the sprite
  }
}


}