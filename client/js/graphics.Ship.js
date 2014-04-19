/*global ASTEROIDGAME */

ASTEROIDGAME.graphics.Ship = (function() {
  'use strict';

  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');

  var MAX_VELOCITY = 800;
  var HYPER_WAIT_TIME = 160;
  var LOOK_FORWARD = 3000;
  var LOOK_BACKWARD = -3000;
  var lastHyperspaceTime = 200;

  function Ship(spec) {
    var that = {
      center: {
        x: spec.center.x,
        y: spec.center.y
      },
      get width() { return canvas.width * 0.05; },
      get height() { return canvas.width * 0.05; },
      velocity: {
        x: 0,
        y: 0
      },
      lives: spec.lives,
      moveRate: spec.moveRate,
      image: spec.image,
      rotation: spec.rotation,
      moving: false,
      shields: {
        count: 3,
        on: false,
        lifetime: 10000, // miliseconds
        hits: 0,
        HIT_MAX: 2,
        startTime: Date.now()
      }
    };

    that.rotateRight = function (elapsedTime) {
      that.rotation += spec.rotateRate * (elapsedTime / 1000);
      createSideParticles(that.rotation +1.2);
      //ASTEROIDGAME.sounds.thrust();
    };

    that.rotateLeft = function (elapsedTime) {
      that.rotation -= spec.rotateRate * (elapsedTime / 1000);
      createSideParticles(that.rotation -1.2);
      //ASTEROIDGAME.sounds.thrust();
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

      //ASTEROIDGAME.sounds.thrust();

      createParticles();
    };

    function overMaxVelocity(velocity) {
      return Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y) > MAX_VELOCITY;
    }

    var particlesToCreate = {
      smoke: 20,
      fire: 100
    };
    function createSideParticles(rotation){
      var particleFire = ASTEROIDGAME.particleSystems.createSystem({
        image: ASTEROIDGAME.images['/img/blueFire.png'],
        center: {
          x: that.center.x+(Math.cos(rotation)*((canvas.width*0.015)/2)),
          y: that.center.y+(Math.sin(rotation)*((canvas.width*0.015)/2))
        },
        direction: rotation,
        size: {
          mean: 7,
          stdev: 2
        },
        speed: {mean: 0.3, stdev: 0.05},
        lifetime: {mean: 70, stdev: 5}
      });

      for(var i = 0;  i < particlesToCreate.fire; ++i){
        particleFire.create();
      }

      spec.particles.push(particleFire);
    }
    function createParticles() {
      //create particles for blast off
      var particlesSmoke = ASTEROIDGAME.particleSystems.createSystem({
        image: ASTEROIDGAME.images['/img/purpleFire.png'],
        center: {
          x: that.center.x+(Math.cos(that.rotation)*((canvas.width*0.03)/2)),
          y: that.center.y+(Math.sin(that.rotation)*((canvas.width*0.03)/2))
        },
        direction: that.rotation,
        speed: {mean: 0.5, stdev: 0.05},
        lifetime: {mean: 200, stdev: 10}
      });

      for(var i = 0; i < particlesToCreate.smoke; ++i){
        particlesSmoke.create();
      }

      var particleFire = ASTEROIDGAME.particleSystems.createSystem({
        image: ASTEROIDGAME.images['/img/blueFire.png'],
        center: {
          x: that.center.x+(Math.cos(that.rotation)*((canvas.width*0.03)/2)),
          y: that.center.y+(Math.sin(that.rotation)*((canvas.width*0.03)/2))
        },
        direction: that.rotation,
        speed: {mean: 0.5, stdev: 0.05},
        lifetime: {mean: 200, stdev: 10}
      });

      for(var i = 0;  i < particlesToCreate.fire; ++i){
        particleFire.create();
      }

      spec.particles.push(particlesSmoke);
      spec.particles.push(particleFire);
    }

    that.turnOnShield = function () {
      if(that.shields.on || that.shields.count <= 0) return;

      console.log('turnOnShield');
      that.shields.startTime = Date.now();
      that.shields.count--;
      that.shields.on = true;
      that.shields.hits = 0;
    }

    that.explode = function (quadrants, asteroids) {
      if(that.shields.on) {
        if(++that.shields.hits >= that.shields.HIT_MAX) that.shields.on = false;
        // do some cool particles
        console.log("We got hit with the shields on!!");
      } else {
        ASTEROIDGAME.graphics.explosions.ship(that.center);
        ASTEROIDGAME.sounds.explode.medium();
        if(that.lives>1){
          that.lives--;
          console.log('You hit an asteroid, lives left: '+ that.lives);
          that.respawn(quadrants, asteroids);
        }
        else{
          console.log("You're Dead, Game over");
          return true;
        }
      }

      return false;
    };
    that.hyperspace = function (elapsedTime, ship, quadrants, asteroids) {
      if(lastHyperspaceTime >HYPER_WAIT_TIME){
        lastHyperspaceTime =0;
        ASTEROIDGAME.sounds.hyperspace();
        ASTEROIDGAME.graphics.explosions.hyperspace(ship.center);
        ship.respawn(quadrants, asteroids);
      }
      else{
        lastHyperspaceTime+=elapsedTime;
      }
    };
    that.respawn = function(quadrants, asteroids){
      asteroids.update(LOOK_FORWARD);
      quadrants.update(LOOK_FORWARD, asteroids.list);

      var quadLoc = quadrants.getLeastPopulated();

      asteroids.update(LOOK_BACKWARD);
      quadrants.update(LOOK_BACKWARD, asteroids.list);
      //check if already in the same spot as safest spot
      if(that.center.x == quadLoc.xCenter&& that.center.x == quadLoc.xCenter){
        quadLoc = quadrants.getLeastPopulated2();
      }

      that.center.x= quadLoc.xCenter;
      that.center.y= quadLoc.yCenter;

      that.velocity.x=0;
      that.velocity.y=0;

      ASTEROIDGAME.sounds.hyperspace();
      ASTEROIDGAME.graphics.explosions.respawn({ x: quadLoc.xCenter, y:quadLoc.yCenter});
      console.log('relocating ship');
    }


    that.update = function(elapsedTime){
      if(that.shields.on && (that.shields.startTime + that.shields.lifetime < Date.now()) ) {
        that.shields.on = false;
      }

      that.center.x += that.velocity.x * (elapsedTime/1000);
      that.center.y += that.velocity.y * (elapsedTime/1000);

      ASTEROIDGAME.graphics.wrapAround(that.center, {width: that.width, height: that.height});

      for(var p in spec.particles){
        spec.particles[p].update(elapsedTime);
      }
    };

    that.render = function() {

      $('#lives').html("Lives:" + that.lives);

      context.save();

      context.translate(that.center.x , that.center.y);
      context.rotate(that.rotation);
      context.translate(-that.center.x , -that.center.y);

      context.drawImage(
        spec.image,
        that.center.x  - that.width/2,
        that.center.y- that.width/2,
        that.width, that.width);

      // Draw Shield
      if(that.shields.on) {
        var shieldWidth = canvas.width * 0.06;
        var shieldImg = that.shields.count==0? ASTEROIDGAME.images['/img/redForceField.png'] : ASTEROIDGAME.images['/img/blueForceField.png']
        context.drawImage(
        shieldImg,
        that.center.x  - shieldWidth/2,
        that.center.y- shieldWidth/2,
        shieldWidth, shieldWidth);
        /*context.beginPath();
        context.arc(that.center.x, that.center.y, that.width/2, 0, 2*Math.PI);
        context.stroke();
        */
      }

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
