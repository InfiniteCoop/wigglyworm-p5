//this class is for the bad antibiotic balls. If the worm collides with a ball,
//the game automaticaly ends.
function Ball() {

  this.initialize = function() {
    this.on = true;
    this.vMin = -5;
    this.vMax = -2;
    this.x = random(width + 200, width + 600);
    this.y = random(0, height);
    this.vx = random(this.vMin, this.vMax);
    this.vy = random(-2, 2);
    this.vr = 1;
    this.r = this.vr * random(10, 30);
    this.spring = 0.2; //ball springiness (for collisions)
    this.c = color(random(100, 255), 0, random(0, 100));
  };

  this.draw = function() {
    if (!this.on) return;
    noStroke();
    fill(this.c, 200);
    ellipse(this.x, this.y, 2 * this.r, 2 * this.r);
  };

  this.update = function() {
    // initialize if necessary
    if (!this.on) {
      if (random(0, 1) < 0.5) this.initialize();
      return;
    }

    //move ball
    this.x += this.vx;
    this.y += this.vy;

    //reverse ball vy when it hits floor/ceiling
    if (this.y > (height - this.r) || this.y < this.r) {
      this.vy = -this.vy;
    }

    // When ball exits screen, re-initialize
    if (this.x < 0) {
      this.on = false;
    }

    this.vMin += -0.1;
  };

  //check for collisions with other balls
  this.bounce = function() {
    for (var i = 0; i < nBalls; i++) {
      // if this is myself, continue
      if (this === balls[i]) continue;
      // distance between two balls
      var d = dist(this.x, this.y, balls[i].x, balls[i].y);
      // minimum distance between two balls
      var md = this.r + balls[i].r;
      // if I collide with one of them
      if (d < md && balls[i].x < width) {
        // push back in the opposite direction
        var dx = (this.x - balls[i].x) / d;
        var dy = (this.y - balls[i].y) / d;
        // check if perfectly overlapping
        if (dx === 0 && dy === 0) {
          dx = random(-1, 1);
          dy = random(-1, 1);
        }
        // compute the speed to add
        var s = min(10, (this.spring * (md - d)));
        this.vx += dx * s;
        this.vy += dy * s;
      }
    }
  };
}
