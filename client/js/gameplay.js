/*jslint browser: true, white: true, plusplus: true */
/*global ASTEROIDGAME, console, KeyEvent, requestAnimationFrame */

var performance = performance || Date;

ASTEROIDGAME.screens['game-play'] = (function() {
  'use strict';

  var mouseCapture = false,
    myMouse = ASTEROIDGAME.input.Mouse(),
    myKeyboard = ASTEROIDGAME.input.Keyboard(),
    myShip = null,
    cancelNextRequest = false,
    myLasers = ASTEROIDGAME.graphics.lasers,
    myAsteroids = ASTEROIDGAME.graphics.asteroids,
    myUFO = ASTEROIDGAME.graphics.UFO,
    myCollisions = ASTEROIDGAME.collision,
    myQuadrants = ASTEROIDGAME.quadrants,
    myExplosions = ASTEROIDGAME.graphics.explosions,
    myLevels=ASTEROIDGAME.levels,
    myScore = ASTEROIDGAME.score;

  function initialize() {
    console.log('game initializing...');

    window.onresize = ASTEROIDGAME.graphics.resize;


    myShip = ASTEROIDGAME.graphics.Ship( {
      image : ASTEROIDGAME.images['/img/longBrownShip.png'],
      center : { x : (Math.floor(window.innerWidth/2)), y : (Math.floor(window.innerHeight/2))},
      width : 50, height : 50,
      rotation : Math.PI,
      direction : Math.PI,
      moveRate : 500,     // pixels per second
      rotateRate : 2*Math.PI,  // Radians per second
      particles: [],
      lives: 5
    });

    
    ASTEROIDGAME.playerScore=0;  
    myQuadrants.reset();

    myLasers.reset();
    myAsteroids.reset();
    myLevels.reset();
    myScore.reset();
    myScore.render();

    myLevels.create(myAsteroids, 4);
    myQuadrants.create();

    //
    // Create the keyboard input handler and register the keyboard commands

    myKeyboard.clearRegister();
    myKeyboard.registerCommand(KeyEvent.DOM_VK_LEFT, myShip.rotateLeft);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, myShip.rotateRight);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_UP, myShip.accelerate);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_DOWN, myShip.hyperspace);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_SPACE, myLasers.create);

    var controls = ASTEROIDGAME.screens['controls'].controls();

    myKeyboard.registerCommand(controls.left, myShip.rotateLeft);
    myKeyboard.registerCommand(controls.right, myShip.rotateRight);
    myKeyboard.registerCommand(controls.forward, myShip.accelerate);
    myKeyboard.registerCommand(controls.shoot, myLasers.create);
    myKeyboard.registerCommand(controls.hyperspace, myShip.hyperspace);


    myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
      //
      // Stop the game loop by canceling the request for the next animation frame
      cancelNextRequest = true;
      //
      // Then, return to the main menu
      //ASTEROIDGAME.game.showScreen('game-over');
    });

    ASTEROIDGAME.graphics.resize();
    //
    // Create an ability to move the logo using the mouse
    /*
    myMouse = ASTEROIDGAME.input.Mouse();
    myMouse.registerCommand('mousedown', function(e) {
      mouseCapture = true;
      myShip.moveTo({x : e.clientX, y : e.clientY});
    });

    myMouse.registerCommand('mouseup', function() {
      mouseCapture = false;
    });

    myMouse.registerCommand('mousemove', function(e) {
      if (mouseCapture) {
        myShip.moveTo({x : e.clientX, y : e.clientY});
      }
    });
  */

  }

  //------------------------------------------------------------------
  //
  // This is the Game Loop function!
  //
  //------------------------------------------------------------------
  function gameLoop(time) {
    ASTEROIDGAME.elapsedTime = time - ASTEROIDGAME.lastTimeStamp;
    ASTEROIDGAME.lastTimeStamp = time;

    myKeyboard.update(ASTEROIDGAME.elapsedTime, myShip, myQuadrants);
    myMouse.update(ASTEROIDGAME.elapsedTime);

    ASTEROIDGAME.graphics.clear();
    /**************************************************
    /   Collision detection and Score update
    **************************************************/
    var asteroidHit = myCollisions.checkAsteroidCollision(myShip, myAsteroids.list);

    if(asteroidHit) {
      asteroidHit.explode();

      cancelNextRequest = myShip.explode(); //returns true if no more lives left
      myShip.respawn(myQuadrants.getLeastPopulated());
    }

    var laserHits = myCollisions.checkLaserAsteroidCollision(myLasers.list, myAsteroids.list);

    if(laserHits.length) {
      for(var i in laserHits) {
        //update and render score
        myScore.update('asteroid', laserHits[i].asteroid, myShip);
        myScore.render();

        laserHits[i].asteroid.explode();
        myLasers.list.splice(myLasers.list.indexOf(laserHits[i].laser), 1);
      }
    }

    var ufo = myUFO.getCurrentUFO();

    if(ufo) {
      var ufoHits = myCollisions.collision(ufo, myShip);

      if(ufoHits) console.log(ufoHits);
    }
    /**************************************************
    /   update level after destroying all asteroids
    **************************************************/
    if(myAsteroids.list.length === 0) {
      myLevels.update(myAsteroids);
      myLevels.render();
    }

    /**************************************************
    /   update and render Asteroids, Lasers, Quadrant, UFOs, Explosions
    **************************************************/
    myAsteroids.update(ASTEROIDGAME.elapsedTime);
    myAsteroids.render();

    myQuadrants.update(ASTEROIDGAME.elapsedTime, myAsteroids.list);
    // myQuadrants.render();

    myLasers.update(ASTEROIDGAME.elapsedTime);
    myLasers.render();

    myShip.update(ASTEROIDGAME.elapsedTime);
    myShip.render();

    myUFO.update(ASTEROIDGAME.elapsedTime);
    myUFO.render();

    myExplosions.update(ASTEROIDGAME.elapsedTime);
    myExplosions.render();

    /**************************************************
    /   Check for end game
    **************************************************/
    if (!cancelNextRequest) {
      requestAnimationFrame(gameLoop);
    }
    else{
      ASTEROIDGAME.game.showScreen('game-over');
    }
  }

  function run() {
    console.log('running Game');
    initialize();

    ASTEROIDGAME.lastTimeStamp = performance.now();
    //
    // Start the animation loop
    cancelNextRequest = false;
    myShip.moving = false;
    myKeyboard.clear();
    requestAnimationFrame(gameLoop);

  }

  function cancel(){
    cancelNextRequest = true;
  }

  return {
    initialize : initialize,
    run : run,
    cancel : cancel
  };

}());
