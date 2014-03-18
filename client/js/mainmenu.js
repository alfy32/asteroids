/*jslint browser: true, white: true, plusplus: true */
/*global $, ASTEROIDGAME */

ASTEROIDGAME.screens['main-menu'] = (function() {
  'use strict';

  function initialize() {
    //
    // Setup each of menu events for the screens

    $('#id-new-game').click(showScreen('game-play'));
    $('#id-high-scores').click(showScreen('high-scores'));
    $('#id-help').click(showScreen('help'));
    $('#id-about').click(showScreen('about'));

    $('#id-quit').click(function (e) {
      ASTEROIDGAME.screens['game-play'].cancel();
      ASTEROIDGAME.game.showScreen('about');
    });

    function showScreen(screen) {
      return function (e) {
        ASTEROIDGAME.game.showScreen(screen);
      };
    }
  }

  function run() {
    //
    // I know this is empty, there isn't anything to do.
  }

  return {
    initialize : initialize,
    run : run
  };
}());
