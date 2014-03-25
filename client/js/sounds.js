/*global ASTEROIDGAME */

ASTEROIDGAME.sounds = (function() {
  'use strict';

  function shoot() {
    ASTEROIDGAME.audio['/audio/fire.wav'].play();
  }

  var explode = {
    large: function() {
      ASTEROIDGAME.audio['/audio/bangLarge.wav'].play();
    },
    medium: function() {
      ASTEROIDGAME.audio['/audio/bangMedium.wav'].play();
    },
    small: function() {
      ASTEROIDGAME.audio['/audio/bangSmall.wav'].play();
    },
  };

  function thrust() {
    ASTEROIDGAME.audio['/audio/thrust.wav'].play();
  }

  return {
    shoot: shoot,
    explode: explode,
    thrust: thrust
  };
}());