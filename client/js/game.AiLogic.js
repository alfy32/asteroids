/* globals ASTEROIDGAME, Random, KeyEvent */


ASTEROIDGAME.AiLogic = (function () {
  'use strict';

  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');

  var LOOK_AHEAD = 400;
  var left = KeyEvent.DOM_VK_LEFT,
      right = KeyEvent.DOM_VK_RIGHT,
      accelerate = KeyEvent.DOM_VK_UP,
      hyperspace = KeyEvent.DOM_VK_DOWN,
      shoot = KeyEvent.DOM_VK_SPACE,
      lastUpdateTime = 0,
      stateAccelerate = false,
      stateRotateLeft = false,
      stateRotateRight = false,
      stateShoot = false,
      targetAngle = 180,
      currentAngle = 180,
      currentDirection = 'right';

  var hTime = 0;
  var lastMove = 0;

  function update(elapsedTime, asteroids, ufo, ship, lasers, keyBoard){
    asteroids.update(LOOK_AHEAD);
    keyBoard.keyRelease(hyperspace);

    startShoot(keyBoard);

    var currentDirection = getCurrentDirection(ship);
    var closestAsteroid = findClosestAsteroid(asteroids.list, ship, ufo.getCurrentUFO());

    if(closestAsteroid) {
      var danger = (distance(ship, closestAsteroid) < 100);

      if(danger) asteroids.update(-LOOK_AHEAD/2);
      var targetDirection = getDirection(ship.center, closestAsteroid.center) + Math.PI;
      if(danger) asteroids.update(LOOK_AHEAD/2);

      var tolerance = 0.1;
      if(currentDirection - targetDirection > tolerance) {
        ship.rotateLeft(elapsedTime);
      } else if(currentDirection - targetDirection < -tolerance) {
        ship.rotateRight(elapsedTime);
      }
    }

    hTime += elapsedTime;
    if(hTime > Random.nextRange(2000,3000)) {
      hTime = 0;
      keyBoard.keyPress(hyperspace);
    }

    // lastMove += elapsedTime;
    // if(lastMove > 5000) {
    //   if(lastMove > 5000 + Random.nextRange(150, 250)) {
    //     lastMove = 0;
    //     keyBoard.keyRelease(accelerate);
    //   } else {
    //     keyBoard.keyPress(accelerate);
    //   }
    // }

    asteroids.update(-LOOK_AHEAD);
  }

  function reset() {
    lastUpdateTime = 0;
    stateAccelerate = false;
    stateRotateLeft = false;
    stateRotateRight = false;
    stateShoot = false;
    targetAngle = 90;
    currentAngle = 180;
    currentDirection = 'right';
  }

  function distance(object1, object2) {
    if(object1.center && object2.center) {
      var x = object1.center.x - object2.center.x;
      var y = object1.center.y - object2.center.y;

      return Math.sqrt(x*x + y*y);

    } else {
      return canvas.width;
    }
  }

  // the rotation is based on the back of the ship. I mod it to stay in the range of 0 - 2PI.
  function getCurrentDirection(ship) {
    return (ship.rotation + Math.PI) % (2*Math.PI);
  }

  function getDirection(A, B) {
    return Math.atan2(A.y - B.y, A.x - B.x);
  }

  function findClosestAsteroid(asteroids, ship, ufo){
    var closestAsteroid;
    var minDist = canvas.width;

    for(var i in asteroids) {
      var dist = distance(asteroids[i], ship);
      if(dist < minDist) {
        minDist = dist;
        closestAsteroid = asteroids[i];
      }
    }

    if(distance(ship, ufo) < minDist) closestAsteroid = ufo;

    return closestAsteroid;
  }

  function startShoot(keyBoard){
    if(!stateShoot){
      keyBoard.keyPress(shoot);
      stateShoot = true;
    }
  }

  return {
    update: update,
    reset: reset
  };

})();