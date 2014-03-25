/*global ASTEROIDGAME, Random */

ASTEROIDGAME.graphics.asteroids = (function() {
  'use strict';

  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');

  var asteroids = [];
  var explosions = [];

  var explosionLifeTime = 500; // ms

  var sprite = {
    large: {width: 200, height: 200, top: 0, speed: 30},
    medium: {width: 100, height: 100, top: 200, speed: 40},
    small: {width: 50, height: 50, top: 300, speed: 50},
    numberOfImages: 8
  };

  var drawSize = {
    large: 130,
    medium: 100,
    small: 50
  };

  function create(size) {
    asteroids.push(asteroid({
      center: {
        x: Random.nextRange(100, canvas.width - 100),
        y: Random.nextRange(100, canvas.height - 100)
      },
      direction: Random.nextCircleVector(),
      image: ASTEROIDGAME.images['/img/asteroid-sprite.png'],
      size: size,
      power: 100,
      sizeRatio: 0.08
    }));
  }

  function update(elapsedTime) {
    for(var i in asteroids) {
      asteroids[i].update(elapsedTime);
    }

    for(var i in explosions) {
      explosions[i].alive += elapsedTime;

      if(explosions[i].alive > explosionLifeTime)
        explosions.splice(i, 1);
      else {
        explosions[i].system.create();
        explosions[i].system.create();
        explosions[i].system.update(elapsedTime);
      }
    }
  }

  function render() {
    for(var i in asteroids) {
      asteroids[i].draw();
    }

    for(var i in explosions) {
      explosions[i].system.render();
    }
  }

  function asteroid(spec) {
    var that = {
      center: {
        x: spec.center.x,
        y: spec.center.y
      },
      width: sprite[spec.size].width,
      height: sprite[spec.size].height,
      velocity: {
        x: spec.direction.x * sprite[spec.size].speed,
        y: spec.direction.y * sprite[spec.size].speed
      },
      image: spec.image,
      size: spec.size,
      power: spec.power,
      sizeRatio: spec.sizeRatio,
      imageNumber: Random.nextRange(0,sprite.numberOfImages-1)
    };

    function addExplosion(center) {
      var particleSystem = ASTEROIDGAME.particleSystems.createSystem( {
        image : ASTEROIDGAME.images['/img/fire.png'],
        center: {
          x: center.x,
          y: center.y
        },
        speed: {mean: 0.1, stdev: 0.05},
        lifetime: {mean: 30000, stdev: 100}
      });

      for(var i = 0; i < 20; i++)
        particleSystem.create();

      explosions.push({
        system: particleSystem,
        alive: 0
      });
    }

    function addAsteroid(center, size) {
      asteroids.push(asteroid({
          center: {
            x: center.x,
            y: center.y
          },
          direction: Random.nextCircleVector(),
          image: ASTEROIDGAME.images['/img/asteroid-sprite.png'],
          size: size,
          power: 100,
          sizeRatio: 0.08
        }));
    }

    that.explode = function () {
      addExplosion(that.center);
      ASTEROIDGAME.sounds.explode[that.size]();

      if(that.size == 'large') {
        asteroids.splice(asteroids.indexOf(that), 1);

        addAsteroid(that.center, 'medium');
        addAsteroid(that.center, 'medium');

      } else if(that.size == 'medium') {
        asteroids.splice(asteroids.indexOf(that), 1);

        addAsteroid(that.center, 'small');
        addAsteroid(that.center, 'small');

      } else if(that.size == 'small') {
        asteroids.splice(asteroids.indexOf(that), 1);
      }
    };

    that.accelerate = function (elapsedTime) {
      that.velocity.x += that.power * (elapsedTime/1000);
      that.velocity.y += that.power * (elapsedTime/1000);
    };

    // var lastImageChange = 0;
    // var imageChangeRate = 50;

    that.update = function(elapsedTime){
      // lastImageChange += elapsedTime;

      // if(lastImageChange > imageChangeRate) {
      //   lastImageChange -= imageChangeRate;
      //   that.imageNumber = (that.imageNumber + 1) % sprite.numberOfImages;
      // }

      that.center.x += that.velocity.x * (elapsedTime/1000);
      that.center.y += that.velocity.y * (elapsedTime/1000);

      ASTEROIDGAME.graphics.wrapAround(that.center, {width: that.width, height: that.height});
    };

    that.draw = function() {
      var size = drawSize[that.size];

      context.save();

      context.translate(that.center.y , that.center.y);
      context.rotate(that.rotation);
      context.translate(-that.center.y , -that.center.y);

      context.drawImage(
        that.image,
        imageLeft(), sprite[that.size].top,
        sprite[that.size].width, sprite[that.size].height,
        that.center.x - size/2,
        that.center.y - size/2,
        size, size);

      context.beginPath();
      context.arc(that.center.x, that.center.y, that.width/2, 0, 2*Math.PI);
      context.stroke();

      context.restore();
    };

    function imageLeft() {
      return that.imageNumber * sprite[that.size].width;
    }

    // large 200, 190, 160

    return that;
  }

  return {
    list: asteroids,
    create: create,
    update: update,
    render: render
  };
}());
