/*global ASTEROIDGAME, Random */

ASTEROIDGAME.graphics.asteroids = (function() {
  'use strict';

  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');
  var asteroids = [];

  var params = {
    large: {width: 0.12, height: 0.12, speed: 70},
    medium: {width: 0.08, height: 0.08, speed: 100},
    small: {width: 0.04, height: 0.04, speed: 150}
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
  function undoUpdate(elapsedTime) {
    for(var i in asteroids) {
      asteroids[i].undoUpdate(elapsedTime);
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
      get width() { return canvas.width * params[spec.size].width; },
      get height() { return canvas.width * params[spec.size].height; },
      velocity: {
        x: spec.direction.x * params[spec.size].speed,
        y: spec.direction.y * params[spec.size].speed
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
    undoUpdate: undoUpdate,
    render: render,
    reset: reset
  };
}());
