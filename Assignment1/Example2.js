function setup() {
    createCanvas(200, 200);
  }
  
  function draw() {
    // Set the background color to green
    background(255);
    
    fill(255, 0, 0, 75); // red circle
    ellipse(100, 70, 90, 90); 
    
    fill(0, 255, 0, 75); // green circle
    ellipse(130, 120, 90, 90); 
    
    fill(0, 0, 255, 75); // blue circle
    ellipse(80, 120, 90, 90); 
    
    noStroke(); // disable black outline
  }