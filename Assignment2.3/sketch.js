const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 400

const tremolo = new Tone.Tremolo(2).toDestination().start();

const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    partials: [0, 2, 3, 4]
  },
  envelope: {
      release: 0.3
  }
}).connect(tremolo);

let  relaxedBird;
let flappingBird;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}

function preload() {
  relaxedBird  = loadImage( "images/relaxed.png" );
  flappingBird = loadImage( "images/flapping.png" );
}

function draw() {
  background(220);

  if ( synth.activeVoices > 0 ) {
    image( flappingBird, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );
  }
  else {
    image( relaxedBird, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );
  }
}

function mousePressed() {
  synth.triggerAttackRelease(400, 0.1);
}