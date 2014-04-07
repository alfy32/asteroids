/*global ASTEROIDGAME, Random */

ASTEROIDGAME.graphics.asteroids = (function() {
  'use strict';

  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');
  var asteroids = [];

  var sprite = {
    large: {width: 200, height: 200, top: 0, speed: 70},
    medium: {width: 100, height: 100, top: 200, speed: 100},
    small: {width: 50, height: 50, top: 300, speed: 150},
    numberOfImages: 8
  };

  var drawSize = {
    large: 200,
    medium: 130,
    small: 75
  };

  function getStartingPosition() {
    var center = { x: -100, y: -100 };

    if(Random.nextRange(0,1)) {
      center.y = Random.nextRange(100, canvas.height - 100);
    } else {
      center.x = Random.nextRange(100, canvas.width - 100);
    }

    return center;
  }

  function create(size) {
    asteroids.push(asteroid({
      center: getStartingPosition(),
      direction: Random.nextCircleVector(),
      image: ASTEROIDGAME.images['/img/asteroid.png'],
      size: size,
      sizeRatio: 0.08,
      AiTarget: false
    }));
  }

  function reset() {
    asteroids.length = 0;
  }

  function update(elapsedTime) {
    for(var i in asteroids) {
      asteroids[i].update(elapsedTime);
    }
  }

  function render(canvasType) {
    for(var i in asteroids) {
      asteroids[i].draw(canvasType);
    }
  }

  function asteroid(spec) {
    var that = {
      center: {
        x: spec.center.x,
        y: spec.center.y
      },
      width: drawSize[spec.size],
      height: drawSize[spec.size],
      velocity: {
        x: spec.direction.x * sprite[spec.size].speed,
        y: spec.direction.y * sprite[spec.size].speed
      },
      image: spec.image,
      size: spec.size,
      sizeRatio: spec.sizeRatio,
      rotation: Random.nextRange(0, 2*Math.PI),
      rotateRate: Random.nextGaussian(0.2, 0.1)
    };

    function addAsteroid(center, size) {
      asteroids.push(asteroid({
          center: {
            x: center.x,
            y: center.y
          },
          direction: Random.nextCircleVector(),
          image: ASTEROIDGAME.images['/img/asteroid.png'],
          size: size,
          sizeRatio: 0.08
        }));
    }

    that.explode = function () {
      ASTEROIDGAME.graphics.explosions.asteroid(that.center);
      ASTEROIDGAME.sounds.explode[that.size]();

      if(that.size == 'large') {
        asteroids.splice(asteroids.indexOf(that), 1);

        addAsteroid(that.center, 'medium');
        addAsteroid(that.center, 'medium');
        addAsteroid(that.center, 'medium');

      } else if(that.size == 'medium') {
        asteroids.splice(asteroids.indexOf(that), 1);

        addAsteroid(that.center, 'small');
        addAsteroid(that.center, 'small');
        addAsteroid(that.center, 'small');
        addAsteroid(that.center, 'small');

      } else if(that.size == 'small') {
        asteroids.splice(asteroids.indexOf(that), 1);
      }
    };

    that.update = function(elapsedTime){
      that.rotation += that.rotateRate * (elapsedTime/1000);

      that.center.x += that.velocity.x * (elapsedTime/1000);
      that.center.y += that.velocity.y * (elapsedTime/1000);

      ASTEROIDGAME.graphics.wrapAround(that.center, {width: that.width, height: that.height});
    };

    that.draw = function() {
      var stroke = 'rgba(255, 0, 0, .9)';
      context.save();
      context.translate(that.center.x , that.center.y);
      context.rotate(that.rotation);
      context.translate(-that.center.x , -that.center.y);

      context.drawImage(
      that.image,
      that.center.x - that.width/2,
      that.center.y - that.height/2,
      that.width, that.height);
      context.strokeStyle = stroke;
      if(that.AiTarget){
        context.beginPath();
        context.arc(that.center.x, that.center.y, that.width/2, 0, 2*Math.PI);
        context.stroke();
      }
      context.restore();
    };

    return that;
  }

  return {
    list: asteroids,
    create: create,
    update: update,
    render: render,
    reset: reset
  };
}());
