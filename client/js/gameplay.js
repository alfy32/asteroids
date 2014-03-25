/*jslint browser: true, white: true, plusplus: true */
/*global ASTEROIDGAME, Random, console, KeyEvent, requestAnimationFrame, performance */

ASTEROIDGAME.screens['game-play'] = (function() {
  'use strict';

  var mouseCapture = false,
    myMouse = ASTEROIDGAME.input.Mouse(),
    myKeyboard = ASTEROIDGAME.input.Keyboard(),
    myShip = null,
    cancelNextRequest = false,
    myLasers = ASTEROIDGAME.graphics.lasers,
    myAsteroids = ASTEROIDGAME.graphics.asteroids,
    myCollisions = ASTEROIDGAME.collision;

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
      particles: []
    });

    myAsteroids.create('large');
    myAsteroids.create('large');
    myAsteroids.create('large');
    myAsteroids.create('large');

    //
    // Create the keyboard input handler and register the keyboard commands
    //myKeyboard.registerCommand(KeyEvent.DOM_VK_A, myShip.moveLeft);
    //myKeyboard.registerCommand(KeyEvent.DOM_VK_D, myShip.moveRight);
    //myKeyboard.registerCommand(KeyEvent.DOM_VK_W, myShip.moveUp);
    //myKeyboard.registerCommand(KeyEvent.DOM_VK_S, myShip.moveDown);
    //myKeyboard.registerCommand(KeyEvent.DOM_VK_Q, myShip.rotateLeft);
    //myKeyboard.registerCommand(KeyEvent.DOM_VK_E, myShip.rotateRight);

    myKeyboard.registerCommand(KeyEvent.DOM_VK_LEFT, myShip.rotateLeft);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, myShip.rotateRight);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_UP, myShip.accelerate);

    myKeyboard.registerCommand(KeyEvent.DOM_VK_A, myShip.rotateLeft);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_D, myShip.rotateRight);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_W, myShip.accelerate);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_SPACE, myLasers.create);

    myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
      //
      // Stop the game loop by canceling the request for the next animation frame
      cancelNextRequest = true;
      //
      // Then, return to the main menu
      ASTEROIDGAME.game.showScreen('main-menu');
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

    myKeyboard.update(ASTEROIDGAME.elapsedTime, myShip);
    myMouse.update(ASTEROIDGAME.elapsedTime);

    ASTEROIDGAME.graphics.clear();

    var asteroidHit = myCollisions.checkAsteroidCollision(myShip, myAsteroids.list);

    if(asteroidHit) {
      asteroidHit.explode();
      myShip.explode();
    }

    var laserHits = myCollisions.checkLaserAsteroidCollision(myLasers.list, myAsteroids.list);

    if(laserHits.length) {
      for(var i in laserHits) {
        laserHits[i].asteroid.explode();
        myLasers.list.splice(myLasers.list.indexOf(laserHits[i].laser), 1);
      }
    }

    myAsteroids.update(ASTEROIDGAME.elapsedTime);
    myAsteroids.render();

    myLasers.update(ASTEROIDGAME.elapsedTime);
    myLasers.render();

    myShip.update(ASTEROIDGAME.elapsedTime);
    myShip.draw();

    if (!cancelNextRequest) {
      requestAnimationFrame(gameLoop);
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
