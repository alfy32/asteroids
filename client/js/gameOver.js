/*jslint browser: true, white: true, plusplus: true */
/*global ASTEROIDGAME */

ASTEROIDGAME.screens['game-over'] = (function() {
  'use strict';

  function initialize() {
    
  }

  function run() {
    //
    // I know this is empty, there isn't anything to do.
    $('#final-score').html("Your Score: " + ASTEROIDGAME.playerScore);
  }

  return {
    initialize : initialize,
    run : run
  };
}());
