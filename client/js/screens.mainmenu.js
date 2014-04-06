/*jslint browser: true, white: true, plusplus: true */
/*global $, ASTEROIDGAME */

ASTEROIDGAME.screens['main-menu'] = (function() {
  'use strict';

  var cancelNextRequest = false,
      startScreen = 'game-play',
    menuAsteroids = ASTEROIDGAME.graphics.asteroids;

  function initialize() {
    console.log('menu initializing...');

    window.onresize = ASTEROIDGAME.graphics.resize;
    menuAsteroids.reset();

    //myLevels.create(myAsteroids, 4);
    menuAsteroids.create('large');
    menuAsteroids.create('medium');
    menuAsteroids.create('small');
    menuAsteroids.create('large');
    menuAsteroids.create('medium');
    menuAsteroids.create('small');
    menuAsteroids.create('large');
    menuAsteroids.create('medium');
    menuAsteroids.create('small');
    menuAsteroids.create('large');
    menuAsteroids.create('medium');
    menuAsteroids.create('small');
    ASTEROIDGAME.graphics.resize();

  }

  //------------------------------------------------------------------
  //
  // This is the Game Loop function!
  //
  //------------------------------------------------------------------
  function menuLoop(time) {
    //console.log('menu looping');
    ASTEROIDGAME.elapsedTime = time - ASTEROIDGAME.lastTimeStamp;
    ASTEROIDGAME.elapsedEventTime = time - ASTEROIDGAME.lastEventTime;//set in game.js on mousdown, keydown, mousemove
    ASTEROIDGAME.lastTimeStamp = time;

    ASTEROIDGAME.graphics.clear();

    if(ASTEROIDGAME.elapsedEventTime > ASTEROIDGAME.AI_TIME_OUT){
      //console.log('Start AI: ' + ASTEROIDGAME.elapsedEventTime);
      ASTEROIDGAME.screens['main-menu'].cancel('AI');
      
    }
    /**************************************************
    /   update and render Asteroids, Lasers, Quadrant, UFOs, Explosions
    **************************************************/
    menuAsteroids.update(ASTEROIDGAME.elapsedTime);
    menuAsteroids.render();

    /**************************************************
    /   Check for end game
    **************************************************/
    if (!cancelNextRequest) {
      requestAnimationFrame(menuLoop);
    }
    else{
      //$('.canvas-menu').css('display','none');
      //$('.canvas-main').css('display','block');
        ASTEROIDGAME.game.showScreen(startScreen);
    }
  }

  function run() {
    //ASTEROIDGAME.sounds.backGroundMusic.play();
    console.log('running menu');
    initialize();

    ASTEROIDGAME.lastTimeStamp = performance.now();
    //
    // Start the animation loop
    cancelNextRequest = false;
   // myShip.moving = false;
    //myKeyboard.clear();
    requestAnimationFrame(menuLoop);

  }

  function cancel(start){
    cancelNextRequest = true;
    startScreen = start;
  }

  return {
    initialize : initialize,
    run : run,
    cancel : cancel
  };

}());
