/* globals Modernizr, yepnope, console */

var ASTEROIDGAME = {
  audio : {},
  images : {},
  screens : {},

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
        'preload!/js/jquery-1.11.0.min.js',
        'preload!/js/particle-system.js',
        'preload!/js/graphics.js',
        'preload!/js/graphics.asteroids.js',
        'preload!/js/graphics.Ship.js',
        'preload!/js/graphics.lasers.js',
        'preload!/js/collision.js',
        'preload!/js/quadrants.js',
        'preload!/js/input.js',
        'preload!/js/game.js',
        'preload!/js/mainmenu.js',
        'preload!/js/gameplay.js',
        'preload!/js/highscores.js',
        'preload!/js/gameOver.js',
        'preload!/js/help.js',
        'preload!/js/about.js',
        'preload!/js/random.js',
        'preload!/img/longBrownShip.png',
        'preload!/img/laser.png',
        'preload!/img/fire.png',
        'preload!/img/smoke.png',
        'preload!/img/asteroid-sprite.png',

        'preload!/js/sounds.js',
        'preload!/audio/bangLarge.wav',
        'preload!/audio/bangMedium.wav',
        'preload!/audio/bangSmall.wav',
        'preload!/audio/fire.wav',
        'preload!/audio/thrust.wav'
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
