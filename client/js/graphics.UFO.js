/*global ASTEROIDGAME, Random */

ASTEROIDGAME.graphics.UFO = (function() {
  'use strict';

  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');

  var ufo = {
    small: UFO({center: {x: -10, y: 100}}),
    big: UFO({center: {x: -10, y: canvas.height - 100}}),
    size: 'small',
    render: false
  };

  function getCurrentUFO() {
    if(ufo.render) return ufo[ufo.size];
    else return false;
  }

  function update(elapsedTime) {
    if(ASTEROIDGAME.score.score > 1000) ufo.render = true;

    if(ufo.render) {
      ufo[ufo.size].update(elapsedTime);
      ASTEROIDGAME.graphics.UFO.bullets.update(elapsedTime);
    }
  }

  function render() {
    if(ufo.render) {
      ufo[ufo.size].render();
      ASTEROIDGAME.graphics.UFO.bullets.render();
    }
  }

  function UFO(spec) {
    var that = {
      center: {
        x: spec.center.x,
        y: spec.center.y
      },
      get width() { return canvas.width * 0.04; },
      get height() { return canvas.width * 0.03; },
      velocity: {
        x: 50,
        y: 50
      },
      image: ASTEROIDGAME.images['/img/ufo.png'],
      rotation: 0,
      moving: false,
      audio: ASTEROIDGAME.audio['/audio/saucerBig.wav']
    };

    // that.audio.loop = true;
    // that.audio.play();

    that.goDownLeft = function () {
      that.velocity.x = -Math.abs(that.velocity.x);
      that.velocity.y = Math.abs(that.velocity.y);
    };

    that.goDownRight = function () {
      that.velocity.x = Math.abs(that.velocity.x);
      that.velocity.y = Math.abs(that.velocity.y);
    };

    that.goUpLeft = function () {
      that.velocity.x = -Math.abs(that.velocity.x);
      that.velocity.y = -Math.abs(that.velocity.y);
    };

    that.goUpRight = function () {
      that.velocity.x = Math.abs(that.velocity.x);
      that.velocity.y = -Math.abs(that.velocity.y);
    };

    that.shoot = function () {
      ASTEROIDGAME.sounds.shoot();
      ASTEROIDGAME.graphics.UFO.bullets.create({
        center: that.center,
        velocity: Random.nextCircleVector()
      });
    };

    that.explode = function () {
      that.audio.loop = false;
      ASTEROIDGAME.graphics.explosions.round(that.center);
      ASTEROIDGAME.sounds.explode[that.size]();
    };

    var lastMove = {
      time: 0,
      func: [ 'goDownRight', 'goUpRight' ],
      funcNum: 0
    };

    var lastShot = 0;

    that.update = function(elapsedTime){
      lastMove.time += elapsedTime;

      if(lastMove.time > 2000) {
        lastMove.time = 0;
        lastMove.funcNum = (lastMove.funcNum+1) % 2;
        that[lastMove.func[lastMove.funcNum]]();
      }

      lastShot += elapsedTime;
      if(lastShot > 2500) {
        lastShot = 0;
        that.shoot();
      }

      that.center.x += that.velocity.x * (elapsedTime/1000);
      that.center.y += that.velocity.y * (elapsedTime/1000);

      ASTEROIDGAME.graphics.wrapAround(that.center, {width: that.width, height: that.height});
    };

    that.render = function() {
      context.save();

      context.translate(that.center.x , that.center.y);
      context.rotate(that.rotation);
      context.translate(-that.center.x , -that.center.y);

      context.drawImage(
        that.image,
        that.center.x  - that.width/2,
        that.center.y- that.height/2,
        that.width, that.height);

      context.restore();
    };

    return that;
  }

  return {
    update: update,
    render: render,
    getCurrentUFO: getCurrentUFO
  };
}());
