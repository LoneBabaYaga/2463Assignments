class EffectButton {
  constructor( x, y, label ) {
    this.x = x;
    this.y = y;
    this.label = label;
    this.size = 50;
    this.active = false;
    this.effect = new Tone.Chorus(4).toDestination().start();
  }

  draw() {
    push();
    if ( this.active ) {
      fill( 'purple' );
    }
    else {
      fill( 'white' );
    }
    rect( this.x, this.y, this.size );
    pop();
  }

  onMousePressed() {
    this.active = !this.active;
    this.draw();
    if ( this.active ) {
      //this.effect.frequency = 4;
      this.effect.delayTime = /*2.5*/10;
      this.effect.depth = /*0.5*/10;
    }
    else {
      //this.effect.frequency = 0;
      this.effect.delayTime = 0;
      this.effect.depth = 0;
    }
  }
}

class SampleButton {
  constructor( x, y, filename, label ) {
    this.x = x;
    this.y = y;
    this.filename = filename;
    this.label = label;
    this.size = 50;

    this.player = new Tone.Player("samples/" + this.filename);
    this.player.connect( effectButtons[0].effect );
  }

  draw() {
    push();
    if ( this.player.state == "started" ) {
      fill( 'orange' );
    }
    else {
      fill( 'white' );
    }
    rect( this.x, this.y, this.size );
    pop();
  }

  onMousePressed() {
    this.player.start();
    this.draw();
  }
}

let sampleButtons = [];
let effectButtons = [];

function setup() {
  createCanvas(450, 400);

  effectButtons[0] = new EffectButton( 350, 200, "chorus effect" );

  sampleButtons[0] = new SampleButton(  50, 20, "chime.wav",  "chime"  );
  sampleButtons[1] = new SampleButton( 150, 20, "drum.wav", "drum" );
  sampleButtons[2] = new SampleButton( 250, 20, "guitar.flac",   "guitar"   );
  sampleButtons[3] = new SampleButton( 350, 20, "trumpet.wav", "trumpet" );
}

function draw() {
  background(220);
  
  textAlign( CENTER, TOP );
  
  let drawButton = button => {

    //draw the button
    button.draw();

    //draw the label
    text(
      button.label, button.x + button.size / 2,
      button.y + button.size + 12
    );

  }

  // draw the sample buttons
  for ( let button of sampleButtons ) {
    drawButton( button );
  }

  // draw the effect buttons
  for ( let button of effectButtons ) {
    drawButton( button );
  }
}

function mousePressed() {

  let handleButton = (button) => {
    if (
      button.x <= mouseX && mouseX <= button.x + button.size
      &&
      button.y <= mouseY && mouseY <= button.y + button.size
    ) {
      button.onMousePressed();
    }
  }

  // handle pressing of sampleButtons
  for ( let button of sampleButtons ) {
    handleButton( button );
  }

  // handle pressing of effectButtons
  for ( let button of effectButtons ) {
    handleButton( button );    
  }

}