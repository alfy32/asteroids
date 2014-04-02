/*jslint browser: true, white: true, plusplus: true */
/*global Random */
ASTEROIDGAME.particleSystems = (function(){

  

  function particleSystem(spec) {
    'use strict';
    var canvas = document.getElementById('canvas-main'), 
    context = canvas.getContext('2d');

    var that = {},
      nextName = 1; // unique identifier for the next particle
      that.particles = {}; // Set of all active that.particles

    //------------------------------------------------------------------
    //
    // This creates one new particle
    //
    //------------------------------------------------------------------

    that.create = function() {
      var dir = Random.nextCircleVector();
      if(spec.direction){
        dir = {
                x: Math.cos(spec.direction + Random.nextGaussian(0, .1)),
                y: Math.sin(spec.direction + Random.nextGaussian(0, .1))
              }
      }

      var p = {
          image: spec.image,
          size: Random.nextGaussian(10, 7),
          center: {x: spec.center.x, y: spec.center.y},
          direction: dir,
          speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
          rotation: 0,
          lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev), // How long the particle should live, in seconds
          alive: 0  // How long the particle has been alive, in seconds
        };

      //
      // Ensure we have a valid size - gaussian numbers can be negative
      p.size = Math.max(1, p.size);
      //
      // Same thing with lifetime
      p.lifetime = Math.max(0.01, p.lifetime);
      //
      // Assign a unique name to each particle

      that.particles[nextName++] = p;
 
    };

    //------------------------------------------------------------------
    //
    // Update the state of all that.particles.  This includes remove any that
    // have exceeded their lifetime.
    //
    //------------------------------------------------------------------
    that.update = function(elapsedTime) {
      var removeMe = [],
        value,
        particle;

      for (value in that.particles) {
        if (that.particles.hasOwnProperty(value)) {

          particle = that.particles[value];
          //
          // Update how long it has been alive
          particle.alive += elapsedTime;

          //
          // Update its position
          particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
          particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

          //
          // Rotate proportional to its speed
          particle.rotation += particle.speed / 500;

          //
          // If the lifetime has expired, identify it for removal
          if (particle.alive > particle.lifetime) {
            removeMe.push(value);
          }
        }
      }

      //
      // Remove all of the expired that.particles
      
      for (particle = 0; particle < removeMe.length; particle++) {
        delete that.particles[removeMe[particle]];
      }
      
      removeMe.length = 0;
    };

    function drawParticle(spec) {
      context.save();
      
      context.translate(spec.center.x, spec.center.y);
      context.rotate(spec.rotation);
      context.translate(-spec.center.x, -spec.center.y);
      
      context.drawImage(
        spec.image, 
        spec.center.x - spec.size/2, 
        spec.center.y - spec.size/2,
        spec.size, spec.size);
      
      context.restore();
    }
    //------------------------------------------------------------------
    //
    // Render all that.particles
    //
    //------------------------------------------------------------------
    that.render = function() {
      var value,
        particle;
      var empty = true;
  
      for (value in that.particles) {
        empty = false;
        if (that.particles.hasOwnProperty(value)) {
          particle = that.particles[value];
          drawParticle(particle);

        }
      }
      return empty;
    };

    return that;
  }

return {
  createSystem: particleSystem
}
}());