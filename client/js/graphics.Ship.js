/*global ASTEROIDGAME */

ASTEROIDGAME.graphics.Ship = (function() {
  'use strict';

  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');

  var MAX_VELOCITY = 800;

  function Ship(spec) {
    var that = {
      center: {
        x: spec.center.x,
        y: spec.center.y
      },
      get width() { return canvas.width * 0.06; },
      get height() { return canvas.width * 0.06; },
      velocity: {
        x: 0,
        y: 0
      },
      moveRate: spec.moveRate,
      image: spec.image,
      rotation: spec.rotation,
      moving: false
    };

    that.rotateRight = function (elapsedTime) {
      that.rotation += spec.rotateRate * (elapsedTime / 1000);
    };

    that.rotateLeft = function (elapsedTime) {
      that.rotation -= spec.rotateRate * (elapsedTime / 1000);
    };

    that.accelerate = function (elapsedTime) {
      var newVelocity = {
        x: that.velocity.x + that.moveRate * -Math.cos(that.rotation) * (elapsedTime/1000),
        y: that.velocity.y + that.moveRate * -Math.sin(that.rotation) * (elapsedTime/1000)
      };

      if(!overMaxVelocity(newVelocity)) {
        that.velocity.x = newVelocity.x;
        that.velocity.y = newVelocity.y;
      }

      ASTEROIDGAME.sounds.thrust();

      createParticles();
    };

    function overMaxVelocity(velocity) {
      return Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y) > MAX_VELOCITY;
    }

    var particlesToCreate = {
      smoke: 5,
      fire: 20
    };

    function createParticles() {
      //create particles for blast off
      var particlesSmoke = ASTEROIDGAME.particleSystems.createSystem({
        image: ASTEROIDGAME.images['/img/smoke.png'],
        center: {
          x: that.center.x+(Math.cos(that.rotation)*((canvas.width*0.05)/2)),
          y: that.center.y+(Math.sin(that.rotation)*((canvas.width*0.05)/2))
        },
        speed: {mean: 0.05, stdev: 0.01},
        lifetime: {mean: 200, stdev: 20}
      });

      for(var i = 0; i < particlesToCreate.smoke; ++i){
        particlesSmoke.create();
      }

      var particleFire = ASTEROIDGAME.particleSystems.createSystem({
        image: ASTEROIDGAME.images['/img/fire.png'],
        center: {
          x: that.center.x+(Math.cos(that.rotation)*((canvas.width*0.03)/2)),
          y: that.center.y+(Math.sin(that.rotation)*((canvas.width*0.03)/2))
        },
        speed: {mean: 0.05, stdev: 0.01},
        lifetime: {mean: 300, stdev: 100}
      });

      for(var i = 0;  i < particlesToCreate.fire; ++i){
        particleFire.create();
      }

      spec.particles.push(particlesSmoke);
      spec.particles.push(particleFire);
    }

    that.update = function(elapsedTime){
      that.center.x += that.velocity.x * (elapsedTime/1000);
      that.center.y += that.velocity.y * (elapsedTime/1000);

      ASTEROIDGAME.graphics.wrapAround(that.center, {width: that.width, height: that.height});

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