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
    myBullets = ASTEROIDGAME.graphics.UFO.bullets,
    myCollisions = ASTEROIDGAME.collision,
    myQuadrants = ASTEROIDGAME.quadrants,
    myExplosions = ASTEROIDGAME.graphics.explosions,
    myLevels=ASTEROIDGAME.levels,
    myScore = ASTEROIDGAME.score;

  function initialize() {
    console.log('game initializing...');

    window.onresize = ASTEROIDGAME.graphics.resize;
    ASTEROIDGAME.graphics.clear();

    myShip = ASTEROIDGAME.graphics.Ship( {
      image : ASTEROIDGAME.images['/img/redShip.png'],
      center : { x : (Math.floor(window.innerWidth/2)), y : (Math.floor(window.innerHeight/2))},
      width : 50, height : 50,
      rotation : Math.PI,
      direction : Math.PI,
      moveRate : 500,     // pixels per second
      rotateRate : 2*Math.PI,  // Radians per second
      particles: [],
      lives: 3
    });
    myUFO.setShip(myShip);

    ASTEROIDGAME.playerScore=0;
    myQuadrants.reset();

    myLasers.reset();
    myUFO.reset();
    myBullets.reset();
    myAsteroids.reset();
    myExplosions.reset();
    myLevels.reset();
    myScore.reset();
    myScore.render();
    myLevels.render();

    myLevels.create(myAsteroids, 4);
    myQuadrants.create();

    //
    // Create the keyboard input handler and register the keyboard commands

    myKeyboard.clearRegister();
    myKeyboard.registerCommand(KeyEvent.DOM_VK_LEFT, myShip.rotateLeft, ASTEROIDGAME.sounds.thrust);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, myShip.rotateRight, ASTEROIDGAME.sounds.thrust);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_UP, myShip.accelerate, ASTEROIDGAME.sounds.thrust);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_DOWN, myShip.hyperspace);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_SPACE, myLasers.create);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_Z, myShip.turnOnShield);

    var controls = ASTEROIDGAME.screens['controls'].controls();

    myKeyboard.registerCommand(controls.left, myShip.rotateLeft, ASTEROIDGAME.sounds.thrust);
    myKeyboard.registerCommand(controls.right, myShip.rotateRight,ASTEROIDGAME.sounds.thrust);
    myKeyboard.registerCommand(controls.forward, myShip.accelerate, ASTEROIDGAME.sounds.thrust);
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
    //console.log("game loop");
    ASTEROIDGAME.elapsedTime = time - ASTEROIDGAME.lastTimeStamp;
    ASTEROIDGAME.lastTimeStamp = time;

    myKeyboard.update(ASTEROIDGAME.elapsedTime, myShip, myQuadrants, myAsteroids);
    myMouse.update(ASTEROIDGAME.elapsedTime);

    ASTEROIDGAME.graphics.clear();
    /**************************************************
    /   Collision detection and Score update
    **************************************************/
    myCollisions.circleCircles(myShip, myAsteroids.list,
      function (ship, asteroid) {
        asteroid.explode();
        cancelNextRequest = myShip.explode(myQuadrants, myAsteroids); //returns true if no more lives left
      });

    myCollisions.circlesPoints(myAsteroids.list, myLasers.list,
      function (asteroid, laser) {
        //update and render score
        myScore.update('asteroid', asteroid, myShip);
        myScore.render();

        asteroid.explode();
        myLasers.list.splice(myLasers.list.indexOf(laser), 1);
      });

    var ufo = myUFO.getCurrentUFO();

    if(ufo) {
      myCollisions.circleCircle(ufo, myShip,
        function (ufo, ship) {
          ufo.explode();

          cancelNextRequest = ship.explode(); //returns true if no more lives left
          myShip.respawn(myQuadrants, myAsteroids);
        });

      myCollisions.circlePoints(ufo, myLasers.list,
        function (ufo, laser) {
          ufo.explode();
          myScore.update('saucer', ufo, myShip);
          myScore.render();
          myLasers.list.splice(myLasers.list.indexOf(laser), 1);
        });
    }

    myCollisions.circlePoints(myShip, myBullets.list,
      function (ship, bullet) {
        myBullets.list.splice(myBullets.list.indexOf(bullet),1);

        cancelNextRequest = ship.explode(); //returns true if no more lives left
        ship.respawn(myQuadrants, myAsteroids);
      });

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
    myAsteroids.render('game');

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
      ASTEROIDGAME.sounds.backGroundMusic.stop();
      ASTEROIDGAME.game.showScreen('game-over');
      ASTEROIDGAME.screens['main-menu'].run();
    }
  }

  function run() {
    ASTEROIDGAME.sounds.backGroundMusic.play();
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
