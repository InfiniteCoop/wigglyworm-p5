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



//Instantiate beat detection objects
// BeatDetect beat;
// BeatListener bl;

//GLOBAL VARAIBLES
//the three game states
var menu;
var playing;
var lost;

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

//starting number of joints
var nJoints;

var nSquares;

var nTriangles;

//sound control
var muted;
var gain;

var bloop1;
var bloop3;
var pop1;
var pop2;
var gameOver;
var soundtrack;

var speakerOn;
var speakerOff;

//Create up to 12 joints, but begin with just 6 (see gameInit) 
var joints;

//Create up to 100 balls, but begin with just 10
var balls;

//Create 8 bonus squares
var squares;

//Create four bonus triangles
var triangles;

function preload() {
  font = loadFont('assets/fonts/muli-light.ttf');
  fontBonus = loadFont('assets/fonts/badaboom.ttf');
  fontColor = color(0, random(100, 255), random(100, 240));
  textAlign(CENTER);
  
  
  bloop1 = loadSound("assets/audio/bloop1.mp3");
 	bloop3 = loadSound("assets/audio/bloop3.mp3");
  pop1 = loadSound("assets/audio/pop1.mp3");
  pop2 = loadSound("assets/audio/pop2.mp3");
  gameOver = loadSound("assets/audio/gameover.mp3");
 	soundtrack = loadSound("assets/audio/soundtrack.mp3");
 	
 	  //load sound on/off icons
  speakerOn = loadImage("assets/img/speakerOn.png");
  speakerOff = loadImage("assets/img/speakerOff.png");
  
  
  
}

function setup() {

  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  strokeWeight(0);
  colorMode(RGB, 255);

  menu = 1;
  playing = 2;
  lost = 3;

  muted = false;

  joints = [12];
  balls = [100];
  squares = [20];
  triangles = [10];

  hiScore = 0;
  
    //begin the soundtrack
  // soundtrack.play();
  //soundtrack.loop();

  // //new beat tracker
  // beat = new BeatDetect(soundtrack.bufferSize(), soundtrack.sampleRate());
  // beat.setSensitivity(10);  
  // bl = new BeatListener(beat, soundtrack);

  //initialize the game (see global function)
  gameInit();
}

function draw() {
  background(20, 20, 20);

  //draw appropriate speaker icon
  // soundSpeaker();

  //conditionally draw game modes
  switch (gameState) {
    
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

    //THIS IS THE IN-GAME STATE
    case 2:
      noCursor();
      //draw, update worm joints, balls, squares, triangles
      drawObjects();

      //check for collisions between worm and balls, squares, triangles;
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

//global function that handles all collisions
function collisions() {
  //check for collisions between worm and balls
  //if there are any collisions, game over!
  for (var j = 0; j < nBalls; j++) {
    for (var i = 0; i < nJoints; i++) {
      if (dist(joints[i].x, joints[i].y, balls[j].x, balls[j].y) <= joints[i].r + balls[j].r) {
        gameState = lost;

        //play "game over" sound
        gameOver.play();
      }
    }
  }

  //check for collisions between worm head and visible bonus squares
  for (var k = 0; k < squares.length; k++) {
    if (dist(mouseX, mouseY, squares[k].x, squares[k].y) <= 20) {
      if (squares[k].timer > 40) {
        //play bloop sound
        bloop1.play();

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
        textSize(48);
        textFont(fontBonus);
        text("+100!", (mouseX), (mouseY));

        //temporarily swell wormjoints
        for (var m = 0; m < nJoints; m++) {
          joints[m].r += 1;
        }
      }
    }
  }

  //check for collisions between balls and explosive triangles
  if (dist(mouseX, mouseY, tri.x, tri.y) <= tri.l * 2 && tri.timer == 255) {

    //trigger explosion behavior (see Triangle class) 
    tri.explode = true;

    //play bloop sound
    bloop3.play();
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
  tri.draw();
  tri.update();

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
  nSquares = 8;
  nTriangles = 10;
  
  // Construct joints at center of canvas. 
  for (var i = 0; i < nJoints; i++) {
    joints[i] = new WormJoint(i * width / nJoints, height / 2, 4);
  }

  // Create the antibiotic balls
  for (var j = 0; j < nBalls; j++) {
    balls[j] = new Ball();
  }

  // Create the tasty nutritional squares
  for (var k = 0; k < nSquares; k++) {
    squares[k] = new Square();
  }
  
  // for (var z = 0; z < nTriangles; z++) {
  // 	tri[z] = new Triangle();
  // }

  // // Create the explosive probiotics triangle
  tri = new Triangle();
}

function scoreUpdate() {
  //update score each frame
  score++;

  //update, set high score if current score is greater than previous high score
  hiScore = (score > hiScore) ? score : hiScore;

  //increase level and number of balls every 2000 points
  if (score / 1000 > scoreUpdateBalls) {
    addBall();
    scoreUpdateBalls++;
  } else if (score / 2000 > scoreUpdateJoints) {

    pop1.play();

    addJoint();
    scoreUpdateJoints++;
  }
}

//create an additional ball every 1000 points
function addBall() {
  balls[nBalls] = new Ball();
  nBalls++;
  println("Balls: " + nBalls);
}

//create an additional joint every 2000 points
function addJoint() {
  joints[nJoints] = new WormJoint(mouseX, mouseY, 4);
  nJoints++;
  println("Joints: " + nJoints);
}

function gameOverText() {

  //display "GAME OVER" messages
  textAlign(CENTER);
  fill(245, 20, 0);

  textFont(fontBonus);
  textSize(40);
  text("You killed Timmy!", (width / 2), (height / 2) - 40);
  fill(255);
  textFont(font);
  textSize(20);
  text("Click anywhere to restart game", width / 2, height / 2 + 20);

  //display score in left corner
  textAlign(LEFT);
  textFont(font);
  textSize(20);
  text("SCORE: " + score, 20, (height - 30));


  //display high score in corner
  textAlign(RIGHT);
  textFont(font);
  textSize(20);
  text("HIGH SCORE: " + hiScore, (width - 20), (height - 30));
}


function menuText() {
  //display start messages
  textAlign(CENTER);
  fill(fontColor);
  textFont(fontBonus);
  stroke(255,255,255);
  strokeWeight(10);
  textSize(120);
  text("WIGGLY WORM", width / 2, height / 2 - 60);

  textFont(font);
  textSize(20);
  strokeWeight(0);
  fill(255);
  text("Use the mouse to help Timmy the misunderstood tapeworm evade the red antibiotics!",
    width / 2, height / 2);
  text("Snack on delicious green nutrients to gain bonus points",
    width / 2, height / 2 + 30);
  text("Pop the orange probiotics to destroy nearby antibiotics",
    width / 2, height / 2 + 60);

  textFont(font, 16);
  text("Click anywhere to begin", width / 2, height / 2 + 160);

  //display high score in corner
  textFont(font, 24);
  textAlign(RIGHT);
  text("HIGH SCORE: " + hiScore, (width - 20), (height - 30));
}

function scoreText() {
  //display score in left corner
  textAlign(LEFT);
  fill(255);
  textFont(font, 24);
  text("SCORE: " + score, 20, (height - 30));

  //display high score in right corner
  textAlign(RIGHT);
  text("HIGH SCORE: " + hiScore, (width - 20), (height - 30));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}