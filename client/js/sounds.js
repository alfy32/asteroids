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

  var thrust  ={
    //ASTEROIDGAME.audio['/audio/thrust.wav'].play();
    play:  function(){
          ASTEROIDGAME.audio['/audio/takeOff.wav'].addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
          }, false);
          console.log('play takeOff ***');
          ASTEROIDGAME.audio['/audio/takeOff.wav'].play();
    },
    stop: function(){
      ASTEROIDGAME.audio['/audio/takeOff.wav'].pause();
      ASTEROIDGAME.audio['/audio/takeOff.wav'].currentTime=0;
    }
  }
  function hyperspace(){
    ASTEROIDGAME.audio['/audio/hyperSpace2.wav'].play();
  }
  var backGroundMusic = {
    //started in initialize game.js
  play:  function(){
          ASTEROIDGAME.audio['/audio/backGroundMusic.wav'].addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
          }, false);
          ASTEROIDGAME.audio['/audio/backGroundMusic.wav'].play();
  },
  stop: function(){
      ASTEROIDGAME.audio['/audio/backGroundMusic.wav'].pause();
      ASTEROIDGAME.audio['/audio/backGroundMusic.wav'].currentTime=0;
    }
  }
  return {
    shootSHIP: shootSHIP,
    shootUFO: shootUFO,
    explode: explode,
    thrust: thrust,
    hyperspace: hyperspace,
    backGroundMusic: backGroundMusic
  };
}());