const CANVAS_WIDTH  = 700;
const CANVAS_HEIGHT = 500;

const FRAME_RATE = 24;

// the number of whacked moles required to win the game
const MOLES_TO_WIN = 10;

// the number of whacked friendlies required to lose the game
const FRIENDLIES_TO_LOSE = 3;

// specifies how many milliseconds a
// creature remains in the game
const CREATURE_LINGER_TIME   = 1500;

// explosion fade time in milliseconds
const EXPLOSION_FADE_TIME = 1000;

// the maximum number of creatures that can
// be in the game at once
const MAX_CREATURES = 3;

// the probability of a friendly creature appearing
// NOTE: This number must be between 0.0 and 1.0
const FRIENDLY_PROBABILITY = 0.3;

// the size of each hole
const HOLE_RADIUS = 50;

const holePositions =
[
  // corner holes
  {x:100,y:100},
  {x:600,y:100},
  {x:100,y:400},
  {x:600,y:400},

  // middle hole
  {x:350,y:250},
];

let holes = [];
let numCreatures = 0;
let molesWhacked = 0;
let friendliesWhacked = 0;
let eventScheduler;
let images;

let gameOver = false;
let playerWins = false;

// define values to indicate the game state
const gameStates =
{
  // awaiting a mouse click from the user in order to trigger Tone.js
  // initialization
  awaitingInput : 0,

  // Tone.js initialization has been triggered, but has not completed
  initializing  : 1,

  // Tone.js has completed initialization, but not all sounds have
  // been preloaded yet
  preloading    : 2,

  // all sounds have been preloaded, the background music and the
  // actual game is running
  running       : 3
};

// declare variable to actually hold the game state
let gameState = gameStates["awaitingInput"];

// create a Tone.js Player object for the music
const music = new Tone.Players(
  {
    main    : "sound/theme_music.wav",
    youWin  : "sound/you_win.ogg",
    gameOver: "sound/game_over.wav"
  }
  ).toDestination();

// create a Tone.js Player object for the sound effects
const soundEffects = new Tone.Players(
  {
    moleHit     : "sound/mole_hit.wav",
    friendlyHit : "sound/friendly_hit.wav",
    missed      : "sound/mole_miss.wav"
  }
  ).toDestination();

// increase volume of dog barking sound
soundEffects.player("friendlyHit").volume.value = 15;

class Hole
{
  constructor( posX, posY )
  {
    this.posX = posX;
    this.posY = posY;

    // whether the hole is empty or has a creature inside it
    this.occupied = false;

    // whether the creature in the hole is an evil mole or
    // a friendly creature
    this.friendly = false;

    // whether the creature in the hole has been whacked
    this.whacked = false;

    // the number of milliseconds that the creature has already
    // spent inside the game
    this.progress = 0;
  }

  // This function attempts to spawn a new creature in the hole. It will return true
  // on success, or false if a new creature cannot be spawned, due to a creature
  // already being in the hole.
  spawnCreature( friendly )
  {
    // don't spawn new creature if whole is already occupied
    if ( this.occupied )
      return false;

    // update state of hole
    this.occupied = true;
    this.friendly = friendly;
    this.whacked  = false;
    this.progress = 0;

    // update global state
    numCreatures++;

    return true;
  }

  // This function takes the coordinates of the whack attempt and returns whether a
  // creature was hit.
  processWhackAttempt( posX, posY )
  {
    // return false if hole is not occupied
    if ( !this.occupied )
      return false;

    // return false if creature is already whacked
    if ( this.whacked )
      return false;

    // return false if coordinates not in range of hole
    if (
      Math.abs(posX-this.posX) > HOLE_RADIUS
      ||
      Math.abs(posY-this.posY) > HOLE_RADIUS
    )
    {
        return false;
    }

    // update state of hole
    this.whacked  = true;
    this.progress = 0;

    // update global state and play appropriate sound
    if ( this.friendly )
    {
      friendliesWhacked++;
      soundEffects.player("friendlyHit").start();
    }
    else
    {
      soundEffects.player("moleHit").start();
      molesWhacked++;
    }

    return true;
  }

  // update state and position of the creature in the hole
  // NOTE: This function must be called exactly once per frame,
  //       because it uses the global variable "deltaTime".
  update()
  {
    // do nothing if hole is not occupied
    if ( !this.occupied )
      return;

    // update progress counter
    this.progress += deltaTime;

    // test whether task is finished and act accordingly
    let targetTime;
    if ( this.whacked )
      targetTime = EXPLOSION_FADE_TIME;
    else
      targetTime = CREATURE_LINGER_TIME;
    if ( this.progress >= targetTime )
    {
      // remove the creature from the game
      this.occupied = false;
      numCreatures--;
    }
  }

  // draw the hole and, if occupied, the creature inside it
  draw()
  {
    // draw the hole itself
    circle( this.posX, this.posY, HOLE_RADIUS * 2 );

    // do nothing further if hole is empty
    if ( !this.occupied)
      return;

    if ( this.whacked )
    {
      image( images["explosion"], this.posX - HOLE_RADIUS, this.posY - HOLE_RADIUS, 2 * HOLE_RADIUS, 2 * HOLE_RADIUS );
    }
    else
    {
      if ( this.friendly )
      {
        // since the dog picture is too big for the hole, we must
        // make it a bit smaller
        const FRIENDLY_RADIUS = HOLE_RADIUS - 15;
        image( images["friendly"], this.posX - FRIENDLY_RADIUS, this.posY - FRIENDLY_RADIUS, 2 * FRIENDLY_RADIUS, 2 * FRIENDLY_RADIUS );
      }
      else
      {
        image( images["mole"], this.posX - HOLE_RADIUS, this.posY - HOLE_RADIUS, 2 * HOLE_RADIUS, 2 * HOLE_RADIUS );
      }
    }
  }
}

// This class will schedule new spawn events and actually spawn
// the creatures when it is time for the event to occur.
class EventScheduler
{
  constructor()
  {
    this.scheduleNextEvent();
  }

  // schedule the next event to occur in a
  // random interval between 0.5 to 1.5 seconds
  scheduleNextEvent()
  {
    this.nextEvent = 500 + Math.random() * 1000;
  }

  // check whether it is time for the next event
  // and act accordingly
  // NOTE: This function must be called exactly once per frame,
  //       because it uses the global variable "deltaTime".
  update()
  {
    // update time till next action
    this.nextEvent -= deltaTime;

    // return if it is not yet time for next action
    if ( this.nextEvent > 0 )
      return;

    // schedule the next action, before handling the
    // current event
    this.scheduleNextEvent();

    // do nothing if there are already too many creatures
    if ( numCreatures >= MAX_CREATURES )
    {
      return;
    }

    // randomly select a mole or a friendly creature
    let friendly = false;
    if ( Math.random() < FRIENDLY_PROBABILITY )
    {
      friendly = true;
    }

    // make up to 10 attempts to spawn the creature in a random hole
    for ( let i = 0; i < 10; i++ )
    {
      // generate a random hole index
      let randomHole = Math.floor( Math.random() * holePositions.length );

      // clamp the hole index due to possible rounding error
      if ( randomHole < 0 )
      {
        randomHole = 0;
      }
      if ( randomHole >= holePositions.length )
      {
        randomHole = holePositions.length - 1;
      }

      // attempt to spawn a new creature in the selected hole and
      // break out of loop if successful
      if ( holes[randomHole].spawnCreature( friendly ) )
        break;
    }
  }
}

function preload()
{
  images = {
    "mole":      loadImage( "sprites/mole.png" ),
    "friendly":  loadImage( "sprites/friendly.png" ),
    "explosion": loadImage( "sprites/explosion.png" )
  };
}

function setup()
{
  textSize( 16 );

  // set up canvas
  createCanvas( CANVAS_WIDTH, CANVAS_HEIGHT );

  // set frame rate
  frameRate( FRAME_RATE );

  // fill the global array "holes" with objects of type "Hole"
  for ( let holePosition of holePositions )
  {
    holes.push( new Hole( holePosition.x, holePosition.y ) );
  }

  eventScheduler = new EventScheduler();
}

function draw()
{
  // draw prompt to start or loading screen, if the
  // game has not started yet
  if ( gameState != gameStates["running"] )
  {
    let displayText;

    switch ( gameState )
    {
      case gameStates["awaitingInput"]:
        displayText = "click to start";
        break;
      case gameStates["initializing"]:
        displayText = "initializing sound system";
        break;
      case gameStates["preloading"]:
        displayText = "preloading sounds";
        if ( music.loaded && soundEffects.loaded )
        {
          gameState = gameStates["running"];
          startBackgroundMusic();
        }
        break;
      default:
        displayText = "error";
    }

    background( 220 );

    push();
    textAlign( CENTER, CENTER );
    text( displayText, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 );
    pop();
    return;
  }

  // set background color of game
  background("green");

  // update the eventScheduler
  if ( !gameOver )
    eventScheduler.update();

  // draw the holes and update them beforehand, if the
  // game is not over
  for ( let hole of holes )
  {
    if ( !gameOver )
      hole.update();
    hole.draw();
  }

  // test whether the player has won the game
  if ( !gameOver && molesWhacked >= MOLES_TO_WIN ) {
    gameOver = true;
    playerWins = true;
    music.stopAll();
    music.player("youWin").start();
  }

  // test whether player has lost the game
  if ( !gameOver && friendliesWhacked >= FRIENDLIES_TO_LOSE ) {
    gameOver = true;
    music.stopAll();
    music.player("gameOver").start();
  }

  // draw the counter and timer
  textAlign( LEFT, TOP );
  let displayText = "moles: " + molesWhacked.toString() + "\n";
  displayText += "dogs: " + friendliesWhacked.toString();
  if ( gameOver )
  {
    displayText += "\n";
    if ( playerWins )
    {
      displayText += "You win!";
    }
    else {
      displayText += "Game over";
    }
  }
  push();
  textAlign( CENTER, TOP );
  fill( "orange" );
  text( displayText, CANVAS_WIDTH / 2, 20 );
  pop();
}

function mousePressed()
{
  // initialize Tone.js if waiting for a mouse click, and
  // do nothing if sound is already being initialized or
  // being preloaded
  if ( gameState != gameStates["running"] )
  {
    if ( gameState == gameStates["awaitingInput"] )
    {
      gameState = gameStates["initializing"];
      Tone.start().then( async ()=> gameState = gameStates["preloading"] );
    }

    return;
  }

  // don't do anything if the game is already over
  if ( !gameOver )
  {
    // process the mouse click for all holes and play a sound
    // if creature was hit
    let hit_something = false;
    for ( let hole of holes )
    {
      if ( hole.processWhackAttempt( mouseX, mouseY ) )
      {
        hit_something = true;
        break;
      }
    }

    // play a sound if nothing was hit
    if ( !hit_something )
    {
      soundEffects.player("missed").start();
    }
  }
}

function startBackgroundMusic()
{
  const player = music.player( "main" );
  player.volume.value = -6;
  player.loop = true;
  player.loopStart = 4.4;
  player.loopEnd = 6.0;

  player.start();
}