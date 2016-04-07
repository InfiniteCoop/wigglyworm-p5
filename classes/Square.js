
//a class for the bonus squares. Each square that Timmy consumes grants 100 bonus points.
function Square() {
  
  this.initialize = function() {
    this.on = true;
    this.x = random(width + 400, width + 800);
    this.y = random(0, height);
    this.vx = random(-10, -4);
    this.vy = random(-2, 2);
    this.w = random(10, 15);
    this.timer = 255;
    this.timerBonus = 100;
    this.dt = random(0.1, 5);
    this.dtBonus = 0;
    this.a = 0;
    this.da = random(-0.5, -0.3);
				this.aBlue = TWO_PI;
		  this.daBlue = radians(2);
		  this.spring = 0.05; //ball springiness (for collisions)
   	this.redVal = 0;
				this.greenVal = random(100,255);
				this.blueVal = random(100,255);
				this.soundTimer = 10;
				this.stt = 1;
  };

  this.draw = function() {
    //update color
    if (!this.on) return;
				fill(this.redVal, this.greenVal, this.blueVal, this.timer);
    push();
    translate(this.x, this.y);
    rotate(this.a);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.w, this.w);
    pop();
  };

  this.update = function() {
    // initialize if necessary
    if (!this.on) {
      if (random(0, 1) < 0.5) this.initialize();
      return;
    }

    //move squares
    this.x += this.vx;
    this.y += this.vy;

    //rotate squares
    this.a += this.da;

    // //update blue color channel
    // this.aBlue += this.daBlue;

    // green = constrain(green, 100, 240);
    // blue = constrain(blue, 100, 240);

    //square transparency decay
    this.timer -= this.dt;
    this.timerBonus -= this.dtBonus;

    //reverse square vy when it hits floor/ceiling
    if (this.y > height - this.w || this.y < this.w) {
      this.vy = -this.vy;
    }

    // When square exits screen, re-initialize
    //x + 601 is to ensure reinitialization if 
    //freak collision sends it in positive x direction
    if (this.x < 0 || this.x > width + 601 || this.timer < 0) {
      this.on = false;
    }
  };

  //check for collisions with other squares; rebound, if necessary
  this.bounce = function() {
    for (var i = 0; i < squares.length; i++) {
      // if this is myself, continue
      if (this === squares[i]) continue;
      // distance between two squares
      var d = dist(this.x, this.y, squares[i].x, squares[i].y);
      // minimum distance between two squares
      var md = this.w + squares[i].w;
      // if I collide with one of them
      if (d < md) {
        // push back in the opposite direction
        var dx = (this.x - squares[i].x) / d;
        var dy = (this.y - squares[i].y) / d;
        // check if perfectly overlapping
        if (dx === 0 && dy === 0) {
          dx = random(-1, 1);
          dy = random(-1, 1);
        }
        // compute the speed to add
        var s = min(10, this.spring * (md - d));
        this.vx += dx * s;
        this.vy += dy * s;
      }
    }
  };
}
