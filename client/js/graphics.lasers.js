/*global ASTEROIDGAME */

ASTEROIDGAME.graphics.lasers = (function() {
  'use strict';

  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');

  var lasers = [];

  var shoot = {
    limit: 300,
    last: 0
  };

  var lifeTime = 1000;

  function create(elapsedTime, ship) {
    if(Date.now() - shoot.last > shoot.limit) {
      shoot.last = Date.now();

      lasers.push(laser({
        center: {
          x: ship.center.x-(Math.cos(ship.rotation)*((canvas.width*0.06)/2)),
          y: ship.center.y-(Math.sin(ship.rotation)*((canvas.width*0.06)/2))
        },
        image: ASTEROIDGAME.images['/img/redLaser.png'],
        direction: ship.rotation
      }));

      ASTEROIDGAME.sounds.shootSHIP();
    }
  }

  function reset() {
    lasers.length = 0;
  }

  function update(elapsedTime) {
    for(var i in lasers) {
      lasers[i].update(elapsedTime);

      if(lasers[i].alive > lifeTime) {
        lasers.splice(i,1);
      }
    }
  }

  function render(elapsedTime) {
    for(var i in lasers) {
      lasers[i].draw(elapsedTime);
    }
  }

  function laser(spec){
    var that = {
      center: {
        x: spec.center.x,
        y: spec.center.y,
      },
      image: spec.image,
      direction: spec.direction,
      get width() { return canvas.width*0.03; },
      get height() { return canvas.width*0.002; },
      // width: 30,
      // height: 2,
      moveRate: 800,
      alive: 0
    };

    var distance = canvas.height * 9/10;
    var speed = that.moveRate/1000;

    lifeTime = distance/speed;

    that.update = function(elapsedTime){
      that.center.x -= Math.cos(that.direction) * that.moveRate * (elapsedTime / 1000);
      that.center.y -= Math.sin(that.direction) * that.moveRate * (elapsedTime / 1000);

      that.alive += elapsedTime;

      ASTEROIDGAME.graphics.wrapAround(that.center, {width: that.width, height: that.height});
    };

    that.draw = function(){
      context.save();

      context.translate(that.center.x , that.center.y );
      context.rotate(that.direction);
      context.translate(-that.center.x , -that.center.y );

      context.drawImage(
        that.image,
        that.center.x - that.width/2,
        that.center.y - that.height/2,
        that.width, that.height
      );

      // context.beginPath();
      // context.arc(that.center.x, that.center.y, that.width/2, 0, 2*Math.PI);
      // context.stroke();

      context.restore();
    };

    return that;
  }

  return {
    list: lasers,
    create: create,
    update: update,
    render: render,
    reset: reset
  };
}());
