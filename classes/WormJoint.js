
//this class defines Timmy's body, which is comprised of joints, links, and his head

function WormJoint(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r; // joint radius
  this.vx = 0; // velocity in the two directions   
  this.vy = 0; // velocity in the two directions   

  var cx;
  var cy; // rest position

  this.k = 0.08; // spring constant
  this.d = 0.75; // damping
  this.hg = 0.5; // horizontal gravity
  // this.c = color(50, 140, 200);
  this.a = TWO_PI;
  this.da = radians(2);
 	this.redVal = 50;
		this.greenVal = 200;
		this.blueVal = 140;
		
  this.draw = function() {
    //update color
    this.bluVal = (140 * (1 + Math.sin(this.a)));
    fill(this.redVal, this.greenVal, this.blueVal);
    println(this.blueVal);

    //draw worm joints
    stroke(this.redVal, this.greenVal, this.blueVal);
    strokeWeight(4);
    line(this.cx, this.cy, this.x, this.y);
    fill(this.redVal, this.greenVal, this.bl);
    //draw worm eye connectors
    strokeWeight(2);
    line(mouseX, mouseY, mouseX + 4, mouseY - 12);
    line(mouseX, mouseY, mouseX - 4, mouseY - 12);
    //draw worm head
    noStroke();
    ellipse(mouseX, mouseY + 2, 3 * this.r, 3.5 * this.r);
    ellipse(this.x, this.y, 2 * this.r, 2 * this.r);
    //draw worm eyes
    fill(255);
    ellipse(mouseX + 4, mouseY - 12, 1.5 * this.r, 1.5 * this.r);
    ellipse(mouseX - 4, mouseY - 12, 1.5 * this.r, 1.5 * this.r);
    fill(0);
    ellipse(mouseX + 4, mouseY - 12, this.r - 2, this.r - 2);
    ellipse(mouseX - 4, mouseY - 12, this.r - 2, this.r - 2);
    //draw worm mouth
    stroke(0);
    line(mouseX - 2, mouseY + 4, mouseX + 2, mouseY + 4);
  };

  // Update the spring with a new center
  this.update = function(cx, cy) {
  	
    // set the new center
    this.cx = cx;
    this.cy = cy;

    // usual spring stuff
    this.vx -= this.k * (this.x - this.cx);
    this.vy -= this.k * (this.y - this.cy);
    this.vx -= this.hg;
    this.vx *= this.d;
    this.vy *= this.d;
    this.x += this.vx;
    this.y += this.vy;
    
    this.a += this.da;
    this.blueVal = constrain(this.blueVal, 100, 240);

    //re-shrink joints after he eats a bonus square
    this.r *= 0.95;
    if (this.r < 4) this.r = 4;
  };
}