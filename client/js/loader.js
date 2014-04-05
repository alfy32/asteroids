/* globals Modernizr, yepnope, console */

var ASTEROIDGAME = {
  audio : {},
  images : {},
  screens : {},
  playerScore: 0,
  highScores: [],
  status : {
    preloadRequest : 0,
    preloadComplete : 0
  }
};

//------------------------------------------------------------------
//
// Wait until the browser 'onload' is called before starting to load
// any external resources.  This is needed because a lot of JS code
// will want to refer to the HTML document.
//
//------------------------------------------------------------------
window.addEventListener('load', function() {
  'use strict';

  console.log('Loading resources...');
  Modernizr.load([
    {
      load : [
        // Images
        'preload!/img/longBrownShip.png',
        'preload!/img/milleniumFalcon.png',
        'preload!/img/deathStar.png',
        'preload!/img/wingShip.png',
        'preload!/img/redShip.png',
        'preload!/img/laser.png',
        'preload!/img/purpleLaser.png',
        'preload!/img/blueLaser.png',
        'preload!/img/redLaser.png',
        'preload!/img/fire.png',
        'preload!/img/blueFire.png',
        'preload!/img/purpleFire.png',
        'preload!/img/brightRed.png',
        'preload!/img/brightPurple.png',
        'preload!/img/brightGreen.png',
        'preload!/img/brightOrange.png',
        'preload!/img/brightYellow.png',
        'preload!/img/grayGreenBlast.png',
        'preload!/img/grayBlast.png',
        'preload!/img/smoke.png',
        'preload!/img/asteroid.png',
        'preload!/img/ufo.png',

                 // Sounds
        'preload!/js/sounds.js',
        'preload!/audio/bangLarge.wav',
        'preload!/audio/bangMedium.wav',
        'preload!/audio/bangSmall.wav',
        'preload!/audio/fire.wav',
        'preload!/audio/thrust.wav',
        'preload!/audio/blast1.wav',
        'preload!/audio/hyperSpace2.wav',
        'preload!/audio/laserShot2.wav',
        'preload!/audio/saucerBig.wav',
        'preload!/audio/backGroundMusic.wav',
        'preload!/audio/blastOff.wav',
        'preload!/audio/takeOff.wav',
        'preload!/audio/explosion.wav',

        // Javascript
        'preload!/js/jquery-1.11.0.min.js',
        'preload!/js/particle-system.js',
        'preload!/js/random.js',
        'preload!/js/graphics.js',
        'preload!/js/graphics.asteroids.js',
        'preload!/js/graphics.Ship.js',
        'preload!/js/graphics.lasers.js',
        'preload!/js/graphics.UFO.js',
        'preload!/js/graphics.UFO.bullets.js',
        'preload!/js/graphics.explosions.js',
        'preload!/js/collision.js',
        'preload!/js/quadrants.js',
        'preload!/js/input.js',
        'preload!/js/game.js',
        'preload!/js/levels.js',
        'preload!/js/score.js',
        'preload!/js/mainmenu.js',
        'preload!/js/gameplay.js',
        'preload!/js/highscores.js',
        'preload!/js/gameOver.js',
        'preload!/js/controls.js',
        'preload!/js/about.js'



      ],
      complete : function() {
        console.log('All files requested for loading...');
      }
    }
  ]);
}, false);

//
// Extend yepnope with our own 'preload' prefix that...
// * Tracks how many have been requested to load
// * Tracks how many have been loaded
// * Places images into the 'images' object
yepnope.addPrefix('preload', function(resource) {
  'use strict';

  console.log('preloading: ' + resource.url);

  ASTEROIDGAME.status.preloadRequest += 1;

  var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
  var isAudio = /.+\.(wav|mp3)$/i.test(resource.url);

  resource.noexec = isImage || isAudio;

  resource.autoCallback = function(e) {
    if (isImage) {
      var image = new Image();
      image.src = resource.url;

      ASTEROIDGAME.images[resource.url] = image;

    } else if(isAudio) {
      var audio = new Audio(resource.url);

      ASTEROIDGAME.audio[resource.url] = audio;
    }

    ASTEROIDGAME.status.preloadComplete += 1;

    //
    // When everything has finished preloading, go ahead and start the game
    if (ASTEROIDGAME.status.preloadComplete === ASTEROIDGAME.status.preloadRequest) {
      console.log('Preloading complete!');
      ASTEROIDGAME.game.initialize();
    }
  };

  return resource;
});
