/*jslint browser: true, white: true, plusplus: true */
/*global $, ASTEROIDGAME */

// ------------------------------------------------------------------
//
// This is the game object.  Everything about the game is located in
// this object.
//
// ------------------------------------------------------------------

ASTEROIDGAME.game = (function() {
  'use strict';

  function showScreen(id) {
    //hide all screens
    for(var s in ASTEROIDGAME.screens){
      var className = '.' + s;
      //console.log(className);
      $(className).css('display','none');
    }
    //display selected screen

    if(ASTEROIDGAME.screens.hasOwnProperty(id)){

      if(id =='game-play'){
        $('.main').css('display','none');
      }
      else{
        $('.main').css('display','block');
      }

      var className = '.' + id;
      //console.log(className);
      $(className).css('display','block');

      ASTEROIDGAME.screens[id].run();
    }

  }

  //------------------------------------------------------------------
  //
  // This function performs the one-time game initialization.
  //
  //------------------------------------------------------------------
  function initialize() {

    var screen = null;
    //
    // Go through each of the screens and tell them to initialize
    for (screen in ASTEROIDGAME.screens) {
      if (ASTEROIDGAME.screens.hasOwnProperty(screen)) {
        ASTEROIDGAME.screens[screen].initialize();
      }
    }

    //
    // Make the main-menu screen the active one

    showScreen('main-menu');

  }

  return {
    initialize : initialize,
    showScreen : showScreen
  };
}());
