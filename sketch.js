/********************************

 Use the mouse to control Timmy the Tapeworm.
 The longer that Timmy evades the red antibiotics, the more points he gains...
 But the antibiotics gradually multiply in number, and Timmy grows longer 
 and longer, making survival progressively more difficult.
 
 Timmy can snack on green nutrients (squares) to gain bonus points. 
 He can also "explode" the orange probiotics (triangles), which destroy any antibiotics 
 in their immediate vicinity, granting additional bonus points.
 
 ********************************/



//import sound library
// import ddf.minim.*;
// import ddf.minim.analysis.*;


//Import audio library
// Minim minim;

//Instantiate various sound effects, soundtrack
// AudioPlayer bloop1, bloop3;
// AudioPlayer pop1, pop2;
// AudioPlayer gameOver;
// AudioPlayer soundtrack;

//Instantiate beat detection objects
// BeatDetect beat;
// BeatListener bl;

//Instantiate sound on/off PNG icons (drawn in Illustrator)
// PImage speakerOn;
// PImage speakerOff;



//GLOBAL VARAIBLES
//the three game states
var menu = 1;
var playing = 2;
var lost = 3;

//game state constant
var gameState;

//scoring variables
var score;
var hiScore;
var scoreUpdateBalls;
var scoreUpdateTriangles;
var scoreUpdateJoints;

//create font for menus and score
var font;
var fontBonus;
var fontColor;

//starting number of balls
var nBalls;
var nJoints;

//sound control
var muted = false;
var gain;

//Create up to 12 joints, but begin with just 6 (see gameInit) 
var joints = [12];

//Create up to 100 balls, but begin with just 10
var balls = [100];

//Create 8 bonus squares
var squares = [8];

var triangles = [4];

function setup() {

  createCanvas(1000, 600);
  frameRate(30);
  noStroke();

  //initialize the different fonts
  font = textFont("Georgia", 14);
  fontBonus = textFont("Georgia", 48);

  fontColor = color(0, random(100, 255), random(100, 240));
  textAlign(CENTER);

  // //initialize all the sound effects and background music
  // minim = new Minim(this);

  // bloop1 = minim.loadFile("audio/bloop1.mp3");
  // bloop1.setGain(20);

  // bloop3 = minim.loadFile("audio/bloop3.mp3");
  // bloop3.setGain(40);

  // pop1 = minim.loadFile("audio/pop1.mp3");
  // pop1.setGain(20);

  // pop2 = minim.loadFile("audio/pop2.mp3");
  // pop2.setGain(40);

  // gameOver = minim.loadFile("audio/gameover.mp3");
  // gameOver.setGain(-10);

  // soundtrack = minim.loadFile("audio/soundtrack.mp3", 1024);
  // soundtrack.setGain(-10);
  // soundtrack.loop();

  // //new beat tracker
  // beat = new BeatDetect(soundtrack.bufferSize(), soundtrack.sampleRate());
  // beat.setSensitivity(10);  
  // bl = new BeatListener(beat, soundtrack);

  // //load sound on/off icons
  // speakerOn = loadImage("speakerOn.png");
  // speakerOff = loadImage("speakerOff.png");


  //initialize the game (see global function)
  gameInit();
}

function draw() {
  background(0);
  
  
//Create 1 explosive triangle
var triangle = new Triangle();


  //begin the soundtrack
  // soundtrack.play();

  //draw appropriate speaker icon
  // soundSpeaker();

  //conditionally draw game modes
  switch (gameState) {

    //THIS IS THE IN-GAME STATE
    case 2:
      noCursor();
      //draw, update worm joints, balls, squares
      drawObjects();

      //check for collisions between worm and balls, squares;
      //make changes to score or game state if necessary
      collisions();

      //update score; add new balls and worm joints if necessary.
      scoreUpdate();

      //draw score, high score text in lower corners
      scoreText();

      //listen for beat, and make squares, triangle pulse w/ kick and snare
      // beatDetect();

      break;

      //END GAME STATE
    case 3:
      noCursor();

      //draw end game text
      gameOverText();

      break;

      //MENU STATE
    case 1:
      noCursor();

      //Draw and update background wiggly worm
      for (var i = 0; i < nJoints; i++) joints[i].draw();

      // Recenter first joint at mouse position
      joints[0].update(mouseX, mouseY);

      // Recenter each following joint at preceding joint
      for (var a = 1; a < nJoints; a++)
        joints[a].update(joints[a - 1].x, joints[a - 1].y);

      //draw main menu text
      menuText();

      break;
  }
}

//if in menu state, mouse click begins game
//if in end game state, mouse click restarts game
function mousePressed() {
  if (gameState === menu) {
    gameState = playing;
  } else if (gameState === lost) {
    gameInit();
  }
}

// function keyPressed() {
//   if (key == 'M' || key == 'm')
//   {
//     if (muted)
//     {
//       soundtrack.unmute();
//       bloop1.unmute();
//       bloop3.unmute();
//       pop1.unmute();
//       pop2.unmute();
//       gameOver.unmute();
//     } 
//     else {
//       soundtrack.mute();
//       bloop1.mute();
//       bloop3.mute();
//       pop1.mute();
//       pop2.mute();
//       gameOver.mute();
//     }
//     muted = !muted;
//   }
// }



//this class is for the bad antibiotic balls. If the worm collides with a ball,
//the game automaticaly ends.
function Ball() {
  // this.on = true;
  // this.vMin = -5;
  // this.vMax = -2;
  // this.x = random(width+200, width+600); 
  // this.y = random(0, height);
  // this.vx = random(this.vMin, this.vMax); 
  // this.vy = random(-2, 2);
  // this.vr = 1;
  // this.r = this.vr * random(10, 30);
  // this.spring = 0.2; //ball springiness (for collisions)
  // this.c = color(random(100, 255), 0, random(0, 100));

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
      if (this.d < this.md && balls[i].x < width) {
        // push back in the opposite direction
        var dx = (this.x - balls[i].x) / this.td;
        var dy = (this.y - balls[i].y) / this.d;
        // check if perfectly overlapping
        if (this.dx === 0 && this.dy === 0) {
          this.dx = random(-1, 1);
          this.dy = random(-1, 1);
        }
        // compute the speed to add
        var s = min(10, this.spring * (this.md - this.d));
        this.vx += this.dx * this.s;
        this.vy += this.dy * this.s;
      }
    }
  };
}

//a class for the bonus squares. Each square that Timmy consumes grants 100 bonus points.
function Square() {
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
  this.red = 50;
  this.green = 200;
  this.blue = 200;

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
  };

  this.draw = function() {
    //update color
    blue = 140 * (1 + sin(this.aBlue));
    if (!this.on) return;
    fill(red, green, blue, this.timer);

    //draw squares
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

    //update blue color channel
    this.aBlue += this.daBlue;

    green = constrain(green, 100, 240);
    blue = constrain(blue, 100, 240);

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
      if (this.d < this.md) {
        // push back in the opposite direction
        var dx = (this.x - squares[i].x) / this.d;
        var dy = (this.y - squares[i].y) / this.d;
        // check if perfectly overlapping
        if (this.dx === 0 && this.dy === 0) {
          this.dx = random(-1, 1);
          this.dy = random(-1, 1);
        }
        // compute the speed to add
        var s = min(10, spring * (this.md - this.d));
        this.vx += this.dx * this.s;
        this.vy += this.dy * this.s;
      }
    }
  };
}

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
    this.dt = 20;
    this.timerBonus = 100;
    this.dtBonus = 1;
    this.a = 0;
    this.da = random(-0.25, -0.05);
  };

  this.draw = function() {
    if (!this.on) return;
    fill(250, 128, 0, this.timer);
    push();
    translate(this.x, this.y);
    rotate(this.a);
    noStroke();
    // triangle(0, this.l, this.l, -this.l, -this.l, -this.l);    
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
    if (this.x < 0 - this.l || this.timer < 20) {
      this.on = false;
    }

    //test to see if triangle has collided with worm head (see collisions() function)
    if (this.explode === true) {
      //trigger triangle appearance change
      this.l += 20;
      this.timerBonus -= this.dtBonus;
      this.timer -= this.dt;

      //destroy any balls that touch triangle
      for (var i = 0; i < nBalls; i++) {
        if (dist(triangle.x, triangle.y, balls[i].x, balls[i].y) < triangle.l * 2 && triangle.timer > 40) {

          // //play pop sound
          // pop2.play();
          // pop2.rewind();

          //remove ball (it will be reinitialized)
          balls[i].on = false;

          //prvar message
          fill((triangle.timerBonus));
          textAlign(CENTER);
          textFont(fontBonus, 48);
          text("+100!", balls[i].x, balls[i].y);

          //update score
          this.score += 100;
        }
      }
    }
  };
}

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
  this.c = color(50, 140, 200);
  this.a = TWO_PI;
  this.da = radians(2);
  // this.bluVal = blue(this.c);


  this.draw = function() {
    //update color

    this.bluVal = 140 * (1 + sin(this.a));
    fill(50,140,this.blueVal);

    //draw worm joints
    stroke(this.c);
    strokeWeight(4);
    line(this.cx, this.cy, this.x, this.y);
    fill(this.c);
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

    green = constrain(green, 100, 240);
    blue = constrain(blue, 100, 240);

    //re-shrink joints after he eats a bonus square
    this.r *= 0.95;
    if (this.r < 4) this.r = 4;
  };
}

//global function that handles all collisions
function collisions() {
  //check for collisions between worm and balls
  //if there are any collisions, game over!
  for (var j = 0; j < nBalls; j++) {
    for (var i = 0; i < nJoints; i++) {
      if (dist(joints[i].x, joints[i].y, balls[j].x, balls[j].y) <= joints[i].r + balls[j].r) {
        gameState = lost;

        //play "game over" sound
        // gameOver.play();
        // gameOver.rewind();
      }
    }
  }

  //check for collisions between worm head and visible bonus squares
  for (var k = 0; k < squares.length; k++) {
    if (dist(mouseX, mouseY, squares[k].x, squares[k].y) <= 20) {
      if (squares[k].timer > 40) {
        //play bloop sound
        // bloop1.play();
        // bloop1.rewind();

        //add 100 bonus points, extinguish+reinitialize square
        score += 100;
        squares[k].timer = 100;
        squares[k].dt = 30;
        squares[k].w += 20;
        squares[k].timerBonus = 100;
        squares[k].dtBonus = 1;

        // show bonus text
        fill((squares[k].timerBonus));
        textAlign(CENTER);
        textFont(fontBonus, 48);
        text("+100!", (mouseX), (mouseY));

        //temporarily swell wormjoints
        for (var m = 0; m < nJoints; m++) {
          joints[m].r += 1;
        }
      }
    }
  }

  //check for collisions between balls and explosive triangles
  if (dist(mouseX, mouseY, triangle.x, triangle.y) <= triangle.l * 2 && triangle.timer == 255) {

    //trigger explosion behavior (see Triangle class) 
    triangle.explode = true;

    //play bloop sound
    // bloop3.play();
    // bloop3.rewind();
  }
}

//global function responsible for drawing and updating all game objects each frame
function drawObjects() {
  // Draw and update balls
  for (var i = 0; i < nBalls; i++) balls[i].draw();
  for (var j = 0; j < nBalls; j++) balls[j].update();
  for (var k = 0; k < nBalls; k++) balls[k].bounce();

  //Draw and update squares
  for (var l = 0; l < squares.length; l++) squares[l].draw();
  for (var m = 0; m < squares.length; m++) squares[m].update();
  for (var n = 0; n < squares.length; n++) squares[n].bounce();

  //Draw and update probiotic triangle
  triangle.draw();
  triangle.update();

  //Draw and update wiggly worm joints
  for (var o = 0; o < nJoints; o++) joints[o].draw();

  // Recenter first joint at the mouse
  joints[0].update(mouseX, mouseY);

  // Recenter each following joint at preceding joint
  for (var p = 1; p < nJoints; p++)
    joints[p].update(joints[p - 1].x, joints[p - 1].y);
}

//global function that initializes the game
function gameInit() {

  //game begins on menu screen with score of 0, 10 balls, 2 worm joints
  gameState = menu;
  score = 0;
  scoreUpdateBalls = 0;
  scoreUpdateJoints = 0;
  nBalls = 10;
  nJoints = 2;


  // Construct joints at center of canvas. 
  for (var i = 0; i < nJoints; i++) {
    joints[i] = new WormJoint(i * width / nJoints, height / 2, 4);
  }

  // Create the antibiotic balls
  for (var j = 0; j < nBalls; j++) {
    balls[j] = new Ball();
  }

  // Create the tasty nutritional squares
  for (var k = 0; k < squares.length; k++) {
    squares[k] = new Square();
  }

  // Create the explosive probiotics triangle
  triangle = new Triangle();
}

function scoreUpdate() {
  //update score each frame
  score++;

  //update, set high score if current score is greater than previous high score
  hiScore = score > hiScore ? score : hiScore;

  //increase level and number of balls every 2000 points
  if (score / 1000 > scoreUpdateBalls) {
    addBall();
    scoreUpdateBalls++;
  } else if (score / 2000 > scoreUpdateJoints) {

    // pop1.play();
    // pop1.rewind();

    addJoint();
    scoreUpdateJoints++;
    println(nJoints);
  }
}

//create an additional ball every 1000 points
function addBall() {
  balls[nBalls] = new Ball();
  nBalls++;
}

//create an additional joint every 2000 points
function addJoint() {
  joints[nJoints] = new WormJoint(mouseX, mouseY, 4);
  nJoints++;
}

function gameOverText() {

  //display "GAME OVER" messages
  textAlign(CENTER);
  fill(245, 20, 0);

  textFont(fontBonus, 60);
  text("You killed Timmy!", (width / 2), (height / 2) - 40);
  fill(255);
  textFont(font, 20);
  text("Click anywhere to restart game", width / 2, height / 2 + 20);

  //display score in left corner
  textAlign(LEFT);
  textFont(font, 20);
  text("SCORE: " + score, 20, (height - 30));


  //display high score in corner
  textAlign(RIGHT);
  text("HIGH SCORE: " + hiScore, (width - 20), (height - 30));
}


function menuText() {
  //display start messages
  textAlign(CENTER);
  fill(fontColor);
  textFont(fontBonus, 100);
  text("WIGGLY WORM", width / 2, height / 2 - 60);

  textFont(font, 12);
  fill(255);
  text("Use the mouse to help Timmy the misunderstood tapeworm evade the red antibiotics!",
    width / 2, height / 2);
  text("Snack on delicious green nutrients to gain bonus points",
    width / 2, height / 2 + 30);
  text("Pop the orange probiotics to destroy nearby antibiotics",
    width / 2, height / 2 + 60);

  textFont(font, 14);
  text("Click anywhere to begin", width / 2, height / 2 + 160);

  //display high score in corner
  textFont(font, 16);
  textAlign(RIGHT);
  text("HIGH SCORE: " + hiScore, (width - 20), (height - 30));
}

function scoreText() {
  //display score in left corner
  textAlign(LEFT);
  fill(255);
  textFont(font);
  text("SCORE: " + score, 20, (height - 30));

  //display high score in right corner
  textAlign(RIGHT);
  text("HIGH SCORE: " + hiScore, (width - 20), (height - 30));
}