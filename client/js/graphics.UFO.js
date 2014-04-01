/*global ASTEROIDGAME, Random */

ASTEROIDGAME.graphics.UFO = (function() {
  'use strict';

  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');

  var bullets = [];

  function create() {
    return UFO({
      center: {
        x: -10,
        y: 100
      }
    });
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
      bullets.push(bullet({
        center: that.center,
        velocity: Random.nextCircleVector()
      }));
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

      for(var i in bullets) {
        bullets[i].update(elapsedTime);
      }
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

      for(var i in bullets) {
        bullets[i].draw();
      }
    };

    return that;
  }

  function bullet(spec) {
    var that = {
      center: {
        x: spec.center.x,
        y: spec.center.y
      },
      radius: 2,
      velocity: {
        x: 100 * spec.velocity.x,
        y: 100 * spec.velocity.y
      },
      alive: 0
    };

    that.update = function (elapsedTime) {
      that.center.x += that.velocity.x * (elapsedTime/1000);
      that.center.y += that.velocity.y * (elapsedTime/1000);
    };

    that.draw = function() {
      context.save();

      context.fillStyle = 'green';

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

  return create;
}());
