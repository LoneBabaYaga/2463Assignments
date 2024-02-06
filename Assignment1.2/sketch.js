let canvasWidth = 600;
let canvasHeight = 400;
let paletteWidth = 50;
let colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'brown', 'white', 'black'];

function setup() {
  createCanvas(canvasWidth + paletteWidth, canvasHeight);

  // Draw blank canvas
  background(255);
  
  // Draw color palette
  drawPalette();
  
  strokeWeight(5);
  
  stroke('black');
}

function drawPalette() {
  let boxHeight = canvasHeight / colors.length;
  
  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    rect(0, i * boxHeight, paletteWidth, boxHeight);
  }
}

function mousePressed() {
  if ( 0 < mouseX && mouseX < paletteWidth) {
    let colorIndex = floor(mouseY / (canvasHeight / colors.length));
    if ( 0 <= colorIndex && colorIndex <= colors.length ) {
        stroke(colors[colorIndex]);
    }
  }
}

function mouseDragged() {
  if ( pmouseX > paletteWidth && mouseX > paletteWidth )
    line(pmouseX, pmouseY, mouseX, mouseY);
}