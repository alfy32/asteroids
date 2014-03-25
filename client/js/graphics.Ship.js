/*global ASTEROIDGAME */

ASTEROIDGAME.graphics.Ship = (function() {
  'use strict';

  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');

  function Ship(spec) {
    var that = {
      center: {
        x: spec.center.x,
        y: spec.center.y
      },
      get width() { return canvas.width * 0.06; },
      direction: spec.direction,
      rotation: spec.rotation,
      moving: false
    };

    that.rotateRight = function(elapsedTime) {
      that.rotation += spec.rotateRate * (elapsedTime / 1000);
    };

    that.rotateLeft = function(elapsedTime) {
      that.rotation -= spec.rotateRate * (elapsedTime / 1000);
    };

    that.moveLeft = function(elapsedTime) {
      that.center.x  -= spec.moveRate * (elapsedTime / 1000);
      if(that.center.x <0){
        that.center.x  = canvas.width;
      }
    };

    that.moveRight = function(elapsedTime) {
      that.center.x  += spec.moveRate * (elapsedTime / 1000);
      if(that.center.x >canvas.width){
        that.center.x  = 0;
      }
    };

    that.moveUp = function(elapsedTime) {
      //console.log('Rotation' + that.rotation);
      //that.center.y-= spec.moveRate * (elapsedTime / 1000);
      that.moving =true;
      that.direction = that.rotation;

      //create particles for blast off
      var particlesSmoke = ASTEROIDGAME.particleSystems.createSystem( {
        image : ASTEROIDGAME.images['/img/smoke.png'],
        center: { x : that.center.x+(Math.cos(that.rotation)*((canvas.width*0.05)/2)),
                  y : that.center.y+(Math.sin(that.rotation)*((canvas.width*0.05)/2))},
        speed: {mean: 0.05, stdev: 0.01},
        lifetime: {mean: 200, stdev: 20}
      });

      for(var i=0; i<5; ++i){
        particlesSmoke.create();
      }

      var particleFire = ASTEROIDGAME.particleSystems.createSystem( {
          image : ASTEROIDGAME.images['/img/fire.png'],
          center: { x : that.center.x+(Math.cos(that.rotation)*((canvas.width*0.03)/2)),
                    y : that.center.y+(Math.sin(that.rotation)*((canvas.width*0.03)/2))},
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
      that.center.y+= spec.moveRate * (elapsedTime / 1000);
      if(that.center.y>canvas.height){
        that.center.y= 0;
      }
    };

    that.moveTo = function(center) {
      spec.center = center;
    };

    that.update = function(elapsedTime){
      if(that.moving){
        that.center.x  -= Math.cos(that.direction) * spec.moveRate * (elapsedTime / 1000);
        that.center.y-= Math.sin(that.direction) * spec.moveRate * (elapsedTime / 1000);
        if(that.center.y<0){
          that.center.y= canvas.height;
        }
        if(that.center.y>canvas.height){
          that.center.y= 0;
        }
        if(that.center.x >canvas.width){
          that.center.x  = 0;
        }

        if(that.center.x <0){
          that.center.x  = canvas.width;
        }
      }
      for(var p in spec.particles){
        spec.particles[p].update(elapsedTime);
      }
    };

    that.draw = function() {
      context.save();

      context.translate(that.center.x , that.center.y);
      context.rotate(that.rotation);
      context.translate(-that.center.x , -that.center.y);

      context.drawImage(
        spec.image,
        that.center.x  - that.width/2,
        that.center.y- that.width/2,
        that.width, that.width);

      context.beginPath();
      context.arc(that.center.x, that.center.y, that.width/2, 0, 2*Math.PI);
      context.stroke();

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
