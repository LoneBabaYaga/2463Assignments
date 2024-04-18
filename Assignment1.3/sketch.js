const CANVAS_WIDTH  = 700;
const CANVAS_HEIGHT = 500;
const CANVAS_GROUND_POSITION = 400;
const CANVAS_GROUND_THICKNESS = 10;
const SPRITE_SIZE = 80;

// move the character down by the specified number
// of pixels, to make the character's feet appear
// to be touching the ground
const CHARACTER_DISPLACEMENT = 8;

const FRAME_RATE = 12;
const CHARACTER_SPEED = 5.0;

const NUM_CHARACTERS = 3;

let characters = [];

const SPRITES_PREFIX = "sprites/";

const spriteSheets = [
  "red.png",
  "round_girl.png",
  "eskimo.png"
];

class Character {

  constructor( posX, direction, spriteSheet ) {

    this.posX = posX;

    // -1 means character is facing left
    // +1 means character is facing right
    this.direction = direction;

    this.spriteSheet = loadImage( SPRITES_PREFIX + spriteSheet );

    // this number stores the current frame of the
    // animation, between 0 and 8
    this.animFrame = 0;

    // whether the character is standing still or moving
    this.standingStill = true;
  }

  // update position of character for the next frame
  update( direction ) {
  
    if ( direction == 0 ) {
      // make character stand still
      this.standingStill = true;
    }
    else {
      // make character not stand still
      this.standingStill = false;

      // make character point in the correct direction
      this.direction = direction;
    }

    if ( direction != 0 ) {
      // update position based on direction
      this.posX += direction * CHARACTER_SPEED;

      // clamp coordinate to canvas
      if ( this.posX < 0 ) {
        this.posX = 0;
      }
      if ( this.posX >= CANVAS_WIDTH ) {
        this.posX = CANVAS_WIDTH - 1;
      }
    }
  }

  // draw the character with the next animation frame
  draw() {

    if ( this.standingStill ) {
      // reset animation frame to standing still
      this.animFrame = 0;
    }
    else {
      // go to next animation frame
      if ( ++this.animFrame == 8 ) {
        this.animFrame = 0;
      }
    }

    // get the current animation frame from sprite sheet
    let frame = this.spriteSheet.get(
      this.animFrame * SPRITE_SIZE, 0,
      SPRITE_SIZE, SPRITE_SIZE
    );

    // draw the current animation frame
    push();
    translate(
      this.posX,
      CANVAS_GROUND_POSITION - ( SPRITE_SIZE - CHARACTER_DISPLACEMENT )
    );
    //if facing left, mirror the image
    if ( this.direction == -1 )
      scale( -1, +1 );
    image( frame, -0.5 * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE );
    pop();
  }
}

function preload() {
  // preload all sprite sheets
  for ( let spriteSheet of spriteSheets ) {
    spriteSheet = loadImage( SPRITES_PREFIX + spriteSheet );
  };
}

function setup() {

  // for every sprite sheet, create a characters with random
  // position and direction
  for ( let spriteSheet of spriteSheets ) {
    let posX = Math.floor( Math.random() * CANVAS_WIDTH );
    let direction;
    if ( Math.round( Math.random() ) == 0 )
      direction = -1;
    else
      direction = +1;
    characters.push( new Character( posX, direction, spriteSheet ) );
  }

  // set up canvas
  createCanvas( CANVAS_WIDTH, CANVAS_HEIGHT );

  // set frame rate
  frameRate( FRAME_RATE );
}

function draw() {
  background(220);

  // draw the ground
  noStroke();
  fill( 'brown' );
  rect( 0, CANVAS_GROUND_POSITION, CANVAS_WIDTH, CANVAS_GROUND_THICKNESS );

  // update and draw all characters
  let direction = 0;
  if ( keyIsDown( LEFT_ARROW ) )
    direction--;
  if ( keyIsDown( RIGHT_ARROW ) )
    direction++;
  for ( let character of characters ) {
      character.update( direction );
      character.draw();
  }
}