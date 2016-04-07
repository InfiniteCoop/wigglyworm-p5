
//a class for the probiotic triangle power-up
function Triangle() {

  this.initialize = function() {
    this.on = true;
    this.explode = false;
    this.x = random(width * 2, width * 3);
    this.y = random(0, height);
    this.vx = random(-12, -8);
    this.vy = random(-4, 4);
    this.l = 10;
    this.timer = 255;
    this.dt = 15;
    this.timerBonus = 255;
    this.dtBonus = 0;
    this.a = 0;
    this.da = random(-0.25, -0.05);
   	this.redVal = 0;
				this.greenVal = random(100,255);
				this.blueVal = random(100,255);
  };

  this.draw = function() {
  	
    if (!this.on) return;
				fill(this.redVal, this.greenVal, this.blueVal, this.timer);
    push();
    translate(this.x, this.y);
    rotate(this.a);
    noStroke();
    triangle(0, this.l, this.l, -this.l, -this.l, -this.l);    
    pop();
  };

  this.update = function() {
    // initialize, if necessary
    if (!this.on) {
      if (random(0, 1) < 0.5) this.initialize();
      return;
    }

    //move triangles
    this.x += this.vx;
    this.y += this.vy;

    //rotate triangles
    this.a += this.da;

    //reverse triangle vy when it hits floor/ceiling
    if (this.y > height - this.l || this.y < this.l) {
      this.vy = -this.vy;
    }

    // When triangle exits screen or becomes invisible, re-initialize
    if (this.x < 0 - this.l || this.timer < 0) {
      this.on = false;
    }

    //test to see if triangle has collided with worm head (see collisions() function)
    if (this.explode === true) {
      //trigger triangle appearance change
      this.l += 10;
      this.timerBonus -= this.dtBonus;
      this.timer -= this.dt;

      //destroy any balls that touch triangle
      for (var i = 0; i < nBalls; i++) {
        if (dist(tri.x, tri.y, balls[i].x, balls[i].y) < tri.l * 2 && tri.timer > 40) {

          // //play pop sound
          pop2.play();
          pop2.playMode('restart');

          //remove ball (it will be reinitialized)
          balls[i].on = false;

          //prvar message
          fill((255,255,255,this.timerBonus));
          textAlign(CENTER);
          textSize(48);
          textFont(fontBonus);
          text("+100!", balls[i].x, balls[i].y);

          //update score
          this.score += 100;
        }
      }
    }
  };
}
