/*global ASTEROIDGAME */

ASTEROIDGAME.graphics.explosions = (function() {
  'use strict';

  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');

  var explosions = [];

  function update(elapsedTime) {
    for(var i in explosions) {
      explosions[i].update(elapsedTime);
    }
  }

  function render() {
    for(var i in explosions) {
      explosions[i].render();
    }
  }

  function reset() {
    explosions.length = 0;
  }

  function asteroid(center) {
    var grayBlast = ASTEROIDGAME.particleSystems.createSystem( {
      image : ASTEROIDGAME.images['/img/grayBlast.png'],
      center: {
        x: center.x,
        y: center.y
      } ,
      speed: {mean: 0.1, stdev: 0.05},
      lifetime: {mean: 1000, stdev: 100}
    });
    var smoke = ASTEROIDGAME.particleSystems.createSystem( {
      image : ASTEROIDGAME.images['/img/smoke.png'],
      center: {
        x: center.x,
        y: center.y
      } ,
      speed: {mean: 0.1, stdev: 0.05},
      lifetime: {mean: 1000, stdev: 100}
    });
    var grayGreen = ASTEROIDGAME.particleSystems.createSystem( {
      image : ASTEROIDGAME.images['/img/grayGreenBlast.png'],
      center: {
        x: center.x,
        y: center.y
      } ,
      speed: {mean: 0.1, stdev: 0.05},
      lifetime: {mean: 1000, stdev: 100}
    });
    var green = ASTEROIDGAME.particleSystems.createSystem( {
      image : ASTEROIDGAME.images['/img/brightGreen.png'],
      center: {
        x: center.x,
        y: center.y
      } ,
      speed: {mean: 0.1, stdev: 0.05},
      lifetime: {mean: 1000, stdev: 100}
    });
    for(var i = 0; i < 40; i++){
      smoke.create();
    }
    for(var i = 0; i < 15; i++){
       grayBlast.create();
      grayGreen.create();
    }
     
    for(var i = 0; i < 8; i++){
    
      green.create();
    }
    explosions.push(green);
    explosions.push(grayGreen);
    explosions.push(grayBlast);
    explosions.push(smoke);
    
  }
  function UFO(center, size) {
    if(size=='small'){
    var fire = ASTEROIDGAME.particleSystems.createSystem( {
      image : ASTEROIDGAME.images['/img/brightPurple.png'],
      center: {
        x: center.x,
        y: center.y
      } ,
      speed: {mean: 0.1, stdev: 0.05},
      lifetime: {mean: 1000, stdev: 100}
    });
  }
  else{
    var fire = ASTEROIDGAME.particleSystems.createSystem( {
      image : ASTEROIDGAME.images['/img/brightYellow.png'],
      center: {
        x: center.x,
        y: center.y
      } ,
      speed: {mean: 0.1, stdev: 0.05},
      lifetime: {mean: 1000, stdev: 100}
    });
  }
    var smoke = ASTEROIDGAME.particleSystems.createSystem( {
      image : ASTEROIDGAME.images['/img/smoke.png'],
      center: {
        x: center.x,
        y: center.y
      } ,
      speed: {mean: 0.1, stdev: 0.05},
      lifetime: {mean: 1000, stdev: 100}
    });
    for(var i = 0; i < 20; i++)
      smoke.create();
    for(var i = 0; i < 60; i++)
      fire.create();

    explosions.push(fire);
    explosions.push(smoke);
  }

  function ship(center) {
    var red = ASTEROIDGAME.particleSystems.createSystem( {
      image : ASTEROIDGAME.images['/img/brightRed.png'],
      center: {
        x: center.x,
        y: center.y
      } ,
      speed: {mean: 0.1, stdev: 0.05},
      lifetime: {mean: 1000, stdev: 100}
    });

    var smoke = ASTEROIDGAME.particleSystems.createSystem( {
      image : ASTEROIDGAME.images['/img/smoke.png'],
      center: {
        x: center.x,
        y: center.y
      } ,
      speed: {mean: 0.1, stdev: 0.05},
      lifetime: {mean: 1000, stdev: 100}
    });
    for(var i = 0; i < 20; i++)
      smoke.create();
    for(var i = 0; i < 60; i++)
      red.create();

    explosions.push(red);
    explosions.push(smoke);
  }

  function hyperspace(center) {
    var orange = ASTEROIDGAME.particleSystems.createSystem( {
      image : ASTEROIDGAME.images['/img/brightOrange.png'],
      center: {
        x: center.x,
        y: center.y
      } ,
      speed: {mean: 0.1, stdev: 0},
      lifetime: {mean: 500, stdev: 0}
    });


    for(var i = 0; i < 500; i++)
      orange.create();

    explosions.push(orange);
  }
  function respawn(center) {
    var blue = ASTEROIDGAME.particleSystems.createSystem( {
      image : ASTEROIDGAME.images['/img/blueFire.png'],
      center: {
        x: center.x,
        y: center.y
      } ,
      speed: {mean: 0.1, stdev: 0},
      lifetime: {mean: 500, stdev: 0}
    });


    for(var i = 0; i < 500; i++)
      blue.create();

    explosions.push(blue);
  }


  return {
    update: update,
    render: render,
    reset: reset,
    asteroid: asteroid,
    UFO: UFO, 
    ship: ship,
    hyperspace: hyperspace,
    respawn: respawn
  };

}());