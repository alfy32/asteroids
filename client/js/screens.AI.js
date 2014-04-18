
  /*jslint browser: true, white: true, plusplus: true */
/*global ASTEROIDGAME, console, KeyEvent, requestAnimationFrame */

ASTEROIDGAME.screens['AI'] = (function() {
  'use strict';


  var aiShip = null,
    cancelNextRequest = false,
    aiKeyboard = ASTEROIDGAME.input.Keyboard(),
    aiLasers = ASTEROIDGAME.graphics.lasers,
    aiAsteroids = ASTEROIDGAME.graphics.asteroids,
    aiUFO = ASTEROIDGAME.graphics.UFO,
    aiBullets = ASTEROIDGAME.graphics.UFO.bullets,
    aiCollisions = ASTEROIDGAME.collision,
    aiQuadrants = ASTEROIDGAME.quadrants,
    aiExplosions = ASTEROIDGAME.graphics.explosions,
    aiLevels=ASTEROIDGAME.levels,
    aiScore = ASTEROIDGAME.score,
    aiLogic = ASTEROIDGAME.AiLogic;

  function initialize() {
    console.log('AI initializing...');

    window.onresize = ASTEROIDGAME.graphics.resize;
    ASTEROIDGAME.graphics.clear();

    aiShip = ASTEROIDGAME.graphics.Ship( {
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
    aiUFO.setShip(aiShip);

    aiKeyboard.clearRegister();
    aiKeyboard.registerCommand(KeyEvent.DOM_VK_LEFT, aiShip.rotateLeft, ASTEROIDGAME.sounds.thrust);
    aiKeyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, aiShip.rotateRight, ASTEROIDGAME.sounds.thrust);
    aiKeyboard.registerCommand(KeyEvent.DOM_VK_UP, aiShip.accelerate, ASTEROIDGAME.sounds.thrust);
    aiKeyboard.registerCommand(KeyEvent.DOM_VK_DOWN, aiShip.hyperspace);
    aiKeyboard.registerCommand(KeyEvent.DOM_VK_SPACE, aiLasers.create);

    ASTEROIDGAME.playerScore=0;
    aiLogic.reset();
    aiQuadrants.reset();
    aiLasers.reset();
    aiUFO.reset();
    aiBullets.reset();
    aiAsteroids.reset();
    aiExplosions.reset();
    aiLevels.reset();
    aiScore.reset();
    aiScore.render();
    aiLevels.render();

    aiLevels.create(aiAsteroids, 4);
    aiQuadrants.create();

    ASTEROIDGAME.graphics.resize();
  }

  //------------------------------------------------------------------
  //
  // This is the Game Loop function!
  //
  //------------------------------------------------------------------

  function AILoop(time) {
    //console.log('AI looping');
    ASTEROIDGAME.elapsedTime = time - ASTEROIDGAME.lastTimeStamp;
    ASTEROIDGAME.lastTimeStamp = time;

    aiKeyboard.update(ASTEROIDGAME.elapsedTime, aiShip, aiQuadrants,aiAsteroids);
    ASTEROIDGAME.graphics.clear();
    /**************************************************
    /   Collision detection and Score update
    **************************************************/

      aiCollisions.circleCircles(aiShip, aiAsteroids.list,
        function (ship, asteroid) {
          asteroid.explode();
          cancelNextRequest = aiShip.explode(aiQuadrants, aiAsteroids); //returns true if no more lives left
        });

      aiCollisions.circlesPoints(aiAsteroids.list, aiLasers.list,
        function (asteroid, laser) {
          //update and render score
          aiScore.update('asteroid', asteroid, aiShip);
          aiScore.render();

          asteroid.explode();
          aiLasers.list.splice(aiLasers.list.indexOf(laser), 1);
        });

      var ufo = aiUFO.getCurrentUFO();

      if(ufo) {
        aiCollisions.circleCircle(ufo, aiShip,
          function (ufo, ship) {
            ufo.explode();

            cancelNextRequest = ship.explode(aiQuadrants, aiAsteroids); //returns true if no more lives left
          });

        aiCollisions.circlePoints(ufo, aiLasers.list,
          function (ufo, laser) {
            ufo.explode();
            aiScore.update('saucer', ufo, aiShip);
            aiScore.render();
            aiLasers.list.splice(aiLasers.list.indexOf(laser), 1);
          });
      }

      aiCollisions.circlePoints(aiShip, aiBullets.list,
        function (ship, bullet) {
          aiBullets.list.splice(aiBullets.list.indexOf(bullet),1);

          cancelNextRequest = ship.explode(aiQuadrants, aiAsteroids); //returns true if no more lives left
        });

      /**************************************************
      /   update level after destroying all asteroids
      **************************************************/
      if(aiAsteroids.list.length === 0) {
        aiLevels.update(aiAsteroids);
        aiLevels.render();
      }

      /**************************************************
      /   update and render AiLogic, Asteroids, Lasers, Quadrant, UFOs, Explosions
      **************************************************/

      aiAsteroids.update(ASTEROIDGAME.elapsedTime);
      aiLogic.update(ASTEROIDGAME.elapsedTime, aiAsteroids, aiUFO, aiShip, aiLasers, aiKeyboard);
      aiAsteroids.render('game');

      aiQuadrants.update(ASTEROIDGAME.elapsedTime, aiAsteroids.list);
      // aiQuadrants.render();

      aiLasers.update(ASTEROIDGAME.elapsedTime);
      aiLasers.render();

      aiShip.update(ASTEROIDGAME.elapsedTime);
      aiShip.render();

      aiUFO.update(ASTEROIDGAME.elapsedTime);
      aiUFO.render();

      aiExplosions.update(ASTEROIDGAME.elapsedTime);
      aiExplosions.render();

      /**************************************************
      /   Check for end game
      **************************************************/
    if (!cancelNextRequest) {
      requestAnimationFrame(AILoop);
    }
    else{
      ASTEROIDGAME.graphics.clear();
      aiKeyboard.clearRegister();
      ASTEROIDGAME.sounds.backGroundMusic.stop();
      ASTEROIDGAME.game.showScreen('main-menu');

    }
  }

  function run() {
    ASTEROIDGAME.sounds.backGroundMusic.play();
    console.log('running AI');
    initialize();

    ASTEROIDGAME.lastTimeStamp = performance.now();
    ASTEROIDGAME.lastEventTimeStamp = performance.now();
    //
    // Start the animation loop
    cancelNextRequest = false;
    aiShip.moving = false;
    requestAnimationFrame(AILoop);

  }

  function cancel(){
    //console.log('canceled AI');
    cancelNextRequest = true;
  }

  return {
    initialize : initialize,
    run : run,
    cancel : cancel
  };

}());

