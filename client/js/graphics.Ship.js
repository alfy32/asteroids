/*global ASTEROIDGAME */

ASTEROIDGAME.graphics.Ship = (function() {
  'use strict';

  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');

  function Ship(spec) {
    var that = {};
    that.centerX = spec.center.x;
    that.centerY = spec.center.y;
    that.direction = spec.direction;
    that.rotation = spec.rotation;
    that.moving = false;

    that.rotateRight = function(elapsedTime) {
      that.rotation += spec.rotateRate * (elapsedTime / 1000);
    };

    that.rotateLeft = function(elapsedTime) {
      that.rotation -= spec.rotateRate * (elapsedTime / 1000);
    };

    that.moveLeft = function(elapsedTime) {
      that.centerX  -= spec.moveRate * (elapsedTime / 1000);
      if(that.centerX <0){
        that.centerX  = canvas.width;
      }
    };

    that.moveRight = function(elapsedTime) {
      that.centerX  += spec.moveRate * (elapsedTime / 1000);
      if(that.centerX >canvas.width){
        that.centerX  = 0;
      }
    };

    that.moveUp = function(elapsedTime) {
      //console.log('Rotation' + that.rotation);
      //that.centerY-= spec.moveRate * (elapsedTime / 1000);
      that.moving =true;
      that.direction = that.rotation;

      //create particles for blast off
      var particlesSmoke = ASTEROIDGAME.particleSystems.createSystem( {
        image : ASTEROIDGAME.images['/img/smoke.png'],
        center: { x : that.centerX+(Math.cos(that.rotation)*((canvas.width*0.05)/2)),
                  y : that.centerY+(Math.sin(that.rotation)*((canvas.width*0.05)/2))},
        speed: {mean: 0.05, stdev: 0.01},
        lifetime: {mean: 200, stdev: 20}
      });

      for(var i=0; i<5; ++i){
        particlesSmoke.create();
      }

      var particleFire = ASTEROIDGAME.particleSystems.createSystem( {
          image : ASTEROIDGAME.images['/img/fire.png'],
          center: { x : that.centerX+(Math.cos(that.rotation)*((canvas.width*0.03)/2)),
                    y : that.centerY+(Math.sin(that.rotation)*((canvas.width*0.03)/2))},
          speed: {mean: 0.05, stdev: 0.01},
          lifetime: {mean: 300, stdev: 100}
        });
      for(var i=0; i<20; ++i){
        particleFire.create();
      }

      spec.particles.push(particlesSmoke);
      spec.particles.push(particleFire);
    };

    that.moveDown = function(elapsedTime) {
      that.centerY+= spec.moveRate * (elapsedTime / 1000);
      if(that.centerY>canvas.height){
        that.centerY= 0;
      }
    };

    that.moveTo = function(center) {
      spec.center = center;
    };

    that.update = function(elapsedTime){
      if(that.moving){
        that.centerX  -= Math.cos(that.direction) * spec.moveRate * (elapsedTime / 1000);
        that.centerY-= Math.sin(that.direction) * spec.moveRate * (elapsedTime / 1000);
        if(that.centerY<0){
          that.centerY= canvas.height;
        }
        if(that.centerY>canvas.height){
          that.centerY= 0;
        }
        if(that.centerX >canvas.width){
          that.centerX  = 0;
        }

        if(that.centerX <0){
          that.centerX  = canvas.width;
        }
      }
      for(var p in spec.particles){
        spec.particles[p].update(elapsedTime);
      }
    };

    that.draw = function() {
      context.save();
      var size = canvas.width*0.06;
      context.translate(that.centerX , that.centerY);
      context.rotate(that.rotation);
      context.translate(-that.centerX , -that.centerY);

      context.drawImage(
        spec.image,
        that.centerX  - size/2,
        that.centerY- size/2,
        size, size);

      context.restore();

      for(var p in spec.particles){

        if(spec.particles[p].render()){
          spec.particles.splice(p,1);
        }
      }
    };

    return that;
  }

  return Ship;
}());
