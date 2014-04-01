/*global ASTEROIDGAME */

ASTEROIDGAME.collision = (function() {
  'use strict';

  function checkCollision(collection1, collection2) {
    var collisions = [];

    for(var item1 in collection1) {
      for(var item2 in collection2) {
        if(collision(collection1[item1], collection2[item2])) {
          collisions.push({
            item1: collection1[item1],
            item2: collection2[item2]
          });
        }
      }
    }

    return collisions;
  }

  function collision(item1, item2) {
    var x = item1.center.x - item2.center.x;
    var y = item1.center.y - item2.center.y;

    var distance = Math.sqrt(x*x + y*y);

    var radius1 = item1.width/2;
    var radius2 = item2.width/2;

    return distance < radius1 + radius2;
  }

  function checkAsteroidCollision(ship, asteroids) {
    for(var i in asteroids) {
      if(collision(ship, asteroids[i])) {
        return asteroids[i];
      }
    }

    return false;
  }

  function checkLaserAsteroidCollision(lasers, asteroids, score) {
    var collisions = [];

    for(var asteroid in asteroids) {
      for(var laser in lasers) {
        if(laserAsteroidCollision(lasers[laser], asteroids[asteroid])) {
          collisions.push({
            laser: lasers[laser],
            asteroid: asteroids[asteroid]
          });
         
          // break so that a laser can only destroy one asteroid.
          break;
        }
      }
    }

    return collisions;
  }

  function laserAsteroidCollision(laser, asteroid) {
    var x = laser.center.x - asteroid.center.x;
    var y = laser.center.y - asteroid.center.y;

    var distance = Math.sqrt(x*x + y*y);

    return distance < asteroid.width/2;
  }

  return {
    checkCollision: checkCollision,
    checkLaserAsteroidCollision: checkLaserAsteroidCollision,
    checkAsteroidCollision: checkAsteroidCollision
  };
}());