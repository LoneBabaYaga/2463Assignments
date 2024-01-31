function setup() {
    createCanvas(300, 175);
  }
  
  function draw() {
    background(0, 0, 0);
    
    fill(255, 255,0); // yellow circle
   arc(70, 90, 145, 145, PI + QUARTER_PI, PI -   QUARTER_PI, PIE); // pacman
  
    fill(255,0,0);
   circle(225, 80, 128); // red circle
  
    fill (255,0, 0);
    rect(161, 80, 128, 80);
    noStroke();
    
    fill(255, 255,255);
   circle(195, 85, 35); // left white eye
  
    fill(255, 255,255, 225);
   circle(255, 85, 35); // right white eye
  
    fill(0, 0,235, 225);
   circle(255, 85, 20); // right blue eye
  
   fill(0, 0,235);
   circle(195, 85, 20); // left blue eye
      
  }