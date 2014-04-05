/*global ASTEROIDGAME */

ASTEROIDGAME.sounds = (function() {
  'use strict';

  function shootSHIP() {
    ASTEROIDGAME.audio['/audio/laserShot2.wav'].play();
  }
  function shootUFO() {
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
  function hyperspace(){
    ASTEROIDGAME.audio['/audio/hyperSpace.wav'].play();
  }
  function backgroundMusic(){
    ASTEROIDGAME.audio['/audio/backGroundMusic.wav'].addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
    ASTEROIDGAME.audio['/audio/backGroundMusic.wav'].play();
  }
  return {
    shootSHIP: shootSHIP,
    shootUFO: shootUFO,
    explode: explode,
    thrust: thrust,
    hyperspace: hyperspace,
    backgroundMusic: backgroundMusic
  };
}());