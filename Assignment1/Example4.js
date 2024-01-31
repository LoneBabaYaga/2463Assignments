function setup() {
    createCanvas(200, 200);
  }
  
  function draw() {
    background(0,0,130);
  
  stroke(255); // White outline
  strokeWeight(3.5); // 
  fill(0, 155, 0); // Green circle
  circle(100, 100, 100);
    
  
  
  fill(255, 0, 0); // red
    stroke(255); // white outline
    strokeWeight(3.5); //
    // Draw a red star
    beginShape();
    vertex(100, 50); // Top point
    vertex(111, 85); // Bottom-right point
    vertex(148, 85); // Bottom-right curve control point
    vertex(118, 106); // Bottom-right curve control point
    vertex(129, 140); // Bottom-right curve control point
    vertex(100, 119); // Bottom point
    vertex(71, 140); // Bottom-left curve control point
    vertex(82, 106); // Bottom-left curve control point
    vertex(52, 85); // Bottom-left curve control point
    vertex(89, 85); // Bottom-left point
    endShape(CLOSE);
  
  }