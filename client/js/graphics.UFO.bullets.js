/*global ASTEROIDGAME */

ASTEROIDGAME.graphics.UFO.bullets = (function() {
  'use strict';

  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');

  var bullets = [];

  function update(elapsedTime) {
    for(var i in bullets) {
      bullets[i].update(elapsedTime);
    }
  }

  function render() {
    for(var i in bullets) {
      bullets[i].draw();
    }
  }

  function reset() {
    bullets.length = 0;
  }

  function create(spec) {
    bullets.push(bullet(spec));
  }

  function bullet(spec) {
    var that = {
      center: {
        x: spec.center.x,
        y: spec.center.y
      },
      radius: 3,
      velocity: {
        x: 400 * spec.velocity.x,
        y: 400 * spec.velocity.y
      },
      alive: 0,
      lifeTime: 800
    };
    
    var distance = canvas.height * 3/4;
    var speed = Math.sqrt(that.velocity.x*that.velocity.x + that.velocity.y*that.velocity.y)/1000;
    
    that.lifeTime = distance/speed;

    that.update = function (elapsedTime) {
      that.alive += elapsedTime;

      if(that.alive > that.lifeTime) {
        bullets.splice(bullets.indexOf(that), 1);
      } else {
        that.center.x += that.velocity.x * (elapsedTime/1000);
        that.center.y += that.velocity.y * (elapsedTime/1000);

        ASTEROIDGAME.graphics.wrapAround(that.center, {width: 2*that.radius, height: 2*that.radius});
      }
    };

    that.draw = function() {
      context.save();

      context.fillStyle = 'white';

      context.beginPath();
      context.arc(
        that.center.x, that.center.y,
        that.radius,
        0, 2*Math.PI
      );
      context.fill();

      context.restore();
    };

    return that;
  }

  return {
    list: bullets,
    update: update,
    render: render,
    reset: reset,
    create: create
  };
}());
