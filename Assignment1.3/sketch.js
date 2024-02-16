// Define character class
class Character {
  constructor(spriteSheet, x, y) {
    this.spriteSheet = spriteSheet;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.isWalking = false;
    this.direction = 1; // 1 for right, -1 for left
    
  }

  draw() {
    const frameWidth = 80;
    const frameHeight = 80;

    const numFrames = Math.floor(this.spriteSheet.width / frameWidth);

    // Draw the current frame of the animation
    push(); // Save the current drawing transformation state
    if (this.direction === 1) {
        // If facing right, draw normally
        image(this.spriteSheet.get(this.frame * frameWidth, 0, frameWidth, frameHeight), this.x, this.y);
    } else {
        // If facing left, flip the sprite horizontally
        scale(-1, 1); // Flip the sprite
        image(this.spriteSheet.get(this.frame * frameWidth, 0, frameWidth, frameHeight), -this.x - frameWidth, this.y); // Offset the x-position to account for the flipped sprite
    }
    pop(); // Restore the previous drawing transformation state

    // Update animation frame
    if (this.isWalking) {
      this.frame = (this.frame + 1) % numFrames;
    }
}


  walk(direction) {
    if (direction === 'right') {
      this.direction = 1;
      this.isWalking = true;
    } else if (direction === 'left') {
      this.direction = -1;
      this.isWalking = true;
    } else {
      this.isWalking = false;
    }
  }

  update() {
    if (this.isWalking) {
        this.x += this.direction * 2; //Walking Speed
    } else {
        // If not walking, reset frame to the standing position
        this.frame = 0;
    }
}
}


// Define character objects
let characters = [];

// Load sprite sheets
let spriteSheet1;
let spriteSheet2;
let spriteSheet3;

function preload() {
  spriteSheet1 = loadImage('RobotSprite.png');
  spriteSheet2 = loadImage('NinjaSprite.png');
  spriteSheet3 = loadImage('VikingSprite.png');
}

function setup() {
  createCanvas(1300, 650);

  // Create character instances
  for (let i = 0; i < 3; i++) {
    characters.push(new Character(spriteSheet1, random(width), random(height)));
    characters.push(new Character(spriteSheet2, random(width), random(height)));
    characters.push(new Character(spriteSheet3, random(width), random(height)));
  }
}

function draw() {
  background(220);

  // Draw and update characters
  for (let character of characters) {
    character.draw();
    character.update();
  }
}

// Handle keyboard input
function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    for (let character of characters) {
      character.walk('right');
    }
  } else if (keyCode === LEFT_ARROW) {
    for (let character of characters) {
      character.walk('left');
    }
  }
}

function keyReleased() {
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
    for (let character of characters) {
      character.walk('');
    }
  }
}