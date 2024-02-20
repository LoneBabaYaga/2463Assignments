// the sprite number which displays the dead squished bug
// NOTE: the animation frames are assumed to go from
// sprite numbers 0 to SQUISHED_FRAME - 1
const SQUISHED_FRAME = 6;
const SPRITE_SIZE = 100;

const CANVAS_WIDTH  = 700;
const CANVAS_HEIGHT = 500;

const FRAME_RATE = 24;
const MAXIMUM_TIME = 30;

const NUM_BUGS = 8;
const INITIAL_SPEED = 4.0;
const SPEED_INCREMENT = 3.0;

let speed = INITIAL_SPEED;
let bugs_squished = 0;
let frameCounter = 0;
let game_over = false;
let player_wins = false;
let spriteSheet;
let bugs = [];

class Bug {

  constructor( posX, posY, course ) {
    this.posX = posX;
    this.posY = posY;

    // 360 degree heading, up = 0, down = 180,
    // right = 90, left = 270, stored as radian
    // I used "course" instead of "heading" because "heading"
    // appears to be a reserved name
    this.course = course / 180.0 * Math.PI;

    // this number stores the current frame of the
    // animation, between 0 and 6
    this.animFrame = 0;

    this.squished = false;
  }

  // update position of bug for the next frame, based on speed,
  // and also change heading if bug "bounces" off wall of canvas
  update() {

    if ( this.squished ) {
      return;
    }

    // update position based on heading and speed
    this.posX += Math.sin(this.course) * speed;
    this.posY -= Math.cos(this.course) * speed;

    // if new coordinate is out of bounds, then "bounce" the
    // bug off the canvas wall
    if ( this.posX < 0 ) {
      this.posX = -this.posX;
      this.course = 4.0 * Math.PI - this.course;
      this.course %= 2.0 * Math.PI;
    }
    else if ( this.posX >= CANVAS_WIDTH ) {
      this.posX -= this.posX - CANVAS_WIDTH;
      this.course = 4.0 * Math.PI - this.course;
      this.course %= 2.0 * Math.PI;
    }
    if ( this.posY < 0 ) {
      this.posY = -this.posY;
      this.course = 3.0 * Math.PI - this.course;
      this.course %= 2 * Math.PI;
    }
    else if ( this.posY >= CANVAS_HEIGHT ) {
      this.posY -= this.posY - CANVAS_HEIGHT;
      this.course = 3.0 * Math.PI - this.course;
      this.course %= 2 * Math.PI;
    }
  }

  // draw the bug with the next animation frame
  draw() {

    if ( this.squished ) {
      let frame = spriteSheet.get( SQUISHED_FRAME * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE );
      push();
      translate( this.posX, this.posY );
      rotate( this.course );
      imageMode( CENTER );
      image( frame, 0, 0, SPRITE_SIZE, SPRITE_SIZE );
      pop();
      //rectMode( CENTER );
      //rect( this.posX, this.posY, SPRITE_SIZE / 2 );
    }
    else {

      // update current animation frame
      if ( ++this.animFrame == SQUISHED_FRAME ) {
        this.animFrame = 0;
      }

      // draw the current animation frame
      let frame = spriteSheet.get( this.animFrame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE );
      push();
      translate( this.posX, this.posY );
      rotate( this.course );
      imageMode( CENTER );
      image( frame, 0, 0, SPRITE_SIZE, SPRITE_SIZE );
      pop();
      //circle( this.posX, this.posY, SPRITE_SIZE / 2 );

    }
  }
}

function preload() {
  spriteSheet = loadImage( "spritesheet.png" );
}

function setup() {

  // create an array of bugs with random position and heading
  for ( let i = 0; i < NUM_BUGS; i++ ) {
    let posX = Math.floor( Math.random() * CANVAS_WIDTH );
    let posY = Math.floor( Math.random() * CANVAS_HEIGHT );
    let course = Math.floor( Math.random() * 360.0 );
    bugs[i] = new Bug( posX, posY, course );
  }

  // set up canvas
  createCanvas( CANVAS_WIDTH, CANVAS_HEIGHT );

  // set frame rate
  frameRate( FRAME_RATE );
}

function draw() {
  background(220);

  // first draw the squished bugs, so that they are at the bottom
  for ( let bug of bugs ) {
    if ( !game_over ) {
      bug.update();
    }
    if ( bug.squished ) {
      bug.draw();
    }
  }

  // now draw the alive bugs
  for ( let bug of bugs ) {
    if ( !bug.squished ) {
      bug.draw();
    }
  }

  // test whether all bugs have been squished
  if ( bugs_squished == NUM_BUGS ) {
    game_over = true;
    player_wins = true;
  }

  // test whether time has run out
  if ( ++frameCounter == FRAME_RATE * MAXIMUM_TIME ) {
    game_over = true;
  }

  // draw the counter and timer
  textAlign( RIGHT, TOP );
  textSize( 16 );
  let displayText = "squished: " + bugs_squished.toString() + "\n";
  if ( game_over ) {
    if ( player_wins ) {
      displayText += "You win!";
    }
    else {
      displayText += "Game over";
    }
  }
  else {
    let secondsRemaining = Math.floor( MAXIMUM_TIME - frameCounter / FRAME_RATE );
    displayText += secondsRemaining.toString() + " seconds remaining";
  }
  text( displayText, CANVAS_WIDTH - 10, 10 );
}

function mousePressed() {
  for ( let bug of bugs ) {
    if (
      Math.abs( mouseX - bug.posX ) <= SPRITE_SIZE / 2
      &&
      Math.abs( mouseY - bug.posY ) <= SPRITE_SIZE / 2
      &&
      !bug.squished
    ) {
        bug.squished = true;
        bugs_squished++;
        speed += SPEED_INCREMENT;
        bug.draw();
    }
  }
}