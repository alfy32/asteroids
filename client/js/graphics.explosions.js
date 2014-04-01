/*global ASTEROIDGAME */

ASTEROIDGAME.graphics.explosions = (function() {
  'use strict';

  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');

  var explosions = [];

  function update(elapsedTime) {
    for(var i in explosions) {
      explosions[i].update(elapsedTime);
    }
  }

  function render() {
    for(var i in explosions) {
      explosions[i].render();
    }
  }

  function round(center) {
    var explosion = ASTEROIDGAME.particleSystems.createSystem( {
      image : ASTEROIDGAME.images['/img/fire.png'],
      center: {
        x: center.x,
        y: center.y
      } ,
      speed: {mean: 0.1, stdev: 0.05},
      lifetime: {mean: 1000, stdev: 100}
    });

    for(var i = 0; i < 20; i++)
      explosion.create();

    explosions.push(explosion);
  }

  return {
    update: update,
    render: render,
    round: round
  };

}());