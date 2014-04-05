/*global ASTEROIDGAME, Random */

ASTEROIDGAME.graphics.UFO = (function() {
  'use strict';

  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');

  var path = [
    {x: -10, y: 100, dir1: 'goDownRight', dir2: 'goUpRight' },
    {x: 100, y: -10, dir1: 'goDownRight', dir2: 'goDownLeft' },
    {get x() { return canvas.width-300; }, y: -10, dir1: 'goDownLeft', dir2: 'goDownRight' },
    {get x() { return canvas.width+10; }, y: 100, dir1: 'goDownLeft', dir2: 'goUpLeft' },
    {get x() { return canvas.width+10; }, get y() { return canvas.height-300; }, dir1: 'goUpLeft', dir2: 'goDownLeft' },
    {get x() { return canvas.width-300; }, get y() { return canvas.height-10; }, dir1: 'goUpLeft', dir2: 'goUpRight' },
    {x: 100, get y() { return canvas.height+10; }, dir1: 'goUpRight', dir2: 'goUpLeft' },
    {x: -10, get y() { return canvas.height-300; }, dir1: 'goUpLeft', dir2: 'goDownLeft' }
  ];

  var ufo = {
    small: UFO({center: {x: -10, y: 100},img: '/img/milleniumFalcon.png'}),
    large: UFO({center: {x: -10, y: canvas.height - 100}, img: '/img/deathStar.png'}),
    size: 'small',
    render: false,
    scoreInterval: 1000,
    score: 0,
    lastScore: 0,
    killed: false,
    currPath: path[Random.nextRange(0, path.length-1)]
  };


  function getCurrentUFO() {
    if(ufo.render) return ufo[ufo.size];
    else return false;
  }

  function setShip(ship) {
    ufo.ship = ship;
  }

  function update(elapsedTime) {
    ufo.score += ASTEROIDGAME.score.score - ufo.lastScore;
    ufo.lastScore = ASTEROIDGAME.score.score;

    if(ufo.score > ufo.scoreInterval) {
      ufo.score = 0;
      ufo.render = true;
      ufo.killed = false;

      if(ufo.size == 'small' && ASTEROIDGAME.score.score < 40000) ufo.size = 'large';
      else ufo.size = 'small';

      ufo.currPath = path[Random.nextRange(0, path.length-1)];
      ufo[ufo.size].center.x = ufo.currPath.x;
      ufo[ufo.size].center.y = ufo.currPath.y;
    }

    if(ufo.killed) ufo.render = false;

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

  function reset() {
    ufo.size = 'small';
    ufo.render = false;
    ufo.killed = false;
  }

  function UFO(spec) {
    var that = {
      center: {
        x: spec.center.x,
        y: spec.center.y
      },
      get width() { return canvas.width * (ufo.size == 'small' ? 0.1 :  0.13); },
      get height() { return canvas.width * (ufo.size == 'small' ? 0.08 : 0.13); },
      velocity: {
        x: 50,
        y: 50
      },
      image: ASTEROIDGAME.images[spec.img], // ASTEROIDGAME.images['/img/wingShip.png'],
      rotation: 0,
      moving: false,
      audio: ASTEROIDGAME.audio['/audio/saucerBig.wav'],
      lifeTime: 500,
      alive: 0
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

    that.shootRandom = function () {
      ASTEROIDGAME.sounds.shootUFO();
      ASTEROIDGAME.graphics.UFO.bullets.create({
        center: that.center,
        velocity: Random.nextCircleVector()
      });
    };

    function unitizeVector(vector) {
      var magnitude = Math.sqrt(vector.x*vector.x + vector.y*vector.y);
      return {
        x: vector.x / magnitude,
        y: vector.y / magnitude
      };
    }

    function getDirectionVector(from, to) {
      return unitizeVector({
        x: to.x - from.x,
        y: to.y - from.y
      });
    }

    that.shootBetter = function () {
      ASTEROIDGAME.sounds.shootUFO();
      ASTEROIDGAME.graphics.UFO.bullets.create({
        center: that.center,
        velocity: getDirectionVector(that.center, ufo.ship.center)
      });
    };

    that.explode = function () {
      that.audio.loop = false;
      ASTEROIDGAME.graphics.explosions.UFO(that.center, ufo.size);
      ASTEROIDGAME.sounds.explode[ufo.size]();
      ufo.killed = true;
    };

    var lastMove = {
      time: 0,
      func: [ 'dir1', 'dir2' ],
      funcNum: 0
    };

    var lastShot = 0;

    that.getSize = function(){
      return ufo.size;
    }
    that.update = function(elapsedTime){
      that.alive += (elapsedTime/1000);
      if(that.alive > that.lifeTime) {
        that.alive = 0;
        ufo.killed = true;
      }

      lastMove.time += elapsedTime;

      if(lastMove.time > 2000) {
        lastMove.time = 0;
        lastMove.funcNum = (lastMove.funcNum+1) % 2;

        that[ufo.currPath[lastMove.func[lastMove.funcNum]]]();
      }

      lastShot += elapsedTime;
      if(lastShot > 2500) {
        lastShot = 0;
        if(ufo.size == 'small') that.shootBetter();
        else that.shootRandom();
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
    reset: reset,
    getCurrentUFO: getCurrentUFO,
    setShip: setShip
  };
}());
