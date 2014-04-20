/*global ASTEROIDGAME */

ASTEROIDGAME.graphics.Ship = (function() {
  'use strict';

  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');

  var MAX_VELOCITY = 800;
  var MAX_SHIELD_WIDTH = .065;
  var MIN_SHIELD_WIDTH = .0005;
  var HYPER_WAIT_TIME = 3200;
  var LOOK_FORWARD = 3000;
  var LOOK_BACKWARD = -3000;
  var lastHyperspaceTime = 0;

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
      hyperAvailable: false,
      lives: spec.lives,
      moveRate: spec.moveRate,
      image: spec.image,
      rotation: spec.rotation,
      moving: false,
      shields: {
        removing: false,
        shieldWidth: 0,
        get width() { if(this.removing){ //shrink shield when time is up
                        if(this.shieldWidth < MIN_SHIELD_WIDTH) 
                          this.removing = false;
                        this.shieldWidth-=.0005;
                        return  canvas.width * this.shieldWidth;
                      }
                      else if(this.shieldWidth < MAX_SHIELD_WIDTH){ //grow shield at start
                        this.shieldWidth+=.00075;
                      }
                         return canvas.width * this.shieldWidth;
                    },
        get height(){ if(this.removing){ 
                          if(this.shieldWidth < MIN_SHIELD_WIDTH) 
                            this.removing = false;
                          this.shieldWidth-=.0005;
                          return  canvas.width * this.shieldWidth;
                      }
                      else if(this.shieldWidth < MAX_SHIELD_WIDTH){
                        this.shieldWidth+=.00075;
                        }
                        return canvas.width * this.shieldWidth;
                    },
        images: {
          red: ASTEROIDGAME.images['/img/redForceField.png'],
          blue: ASTEROIDGAME.images['/img/blueForceField.png']
        },
        count: 3,
        on: false,
        LIFE_TIME: 10000, // miliseconds
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
      fire: 50
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
          x: that.center.x+(Math.cos(that.rotation)*((canvas.width*0.02)/2)),
          y: that.center.y+(Math.sin(that.rotation)*((canvas.width*0.02)/2))
        },
        size: {
          mean: 7,
          stdev: 2
        },
        direction: that.rotation,
        speed: {mean: 0.5, stdev: 0.1},
        lifetime: {mean: 150, stdev: 1}
      });

      var particleRedFire = ASTEROIDGAME.particleSystems.createSystem({
        image: ASTEROIDGAME.images['/img/redFire.png'],
        center: {
          x: that.center.x+(Math.cos(that.rotation)*((canvas.width*0.02)/2)),
          y: that.center.y+(Math.sin(that.rotation)*((canvas.width*0.02)/2))
        },
        size: {
          mean: 10,
          stdev: 4
        },
        direction: that.rotation,
        speed: {mean: 0.4, stdev: 0.1},
        lifetime: {mean: 75, stdev: 1}
      });

      var particleFire = ASTEROIDGAME.particleSystems.createSystem({
        image: ASTEROIDGAME.images['/img/blueFire.png'],
        center: {
          x: that.center.x+(Math.cos(that.rotation)*((canvas.width*0.03)/2)),
          y: that.center.y+(Math.sin(that.rotation)*((canvas.width*0.03)/2))
        },
        size: {
          mean: 12,
          stdev: 8
        },
        direction: that.rotation,
        speed: {mean: 0.6, stdev: 0.15},
        lifetime: {mean: 150, stdev: 1}
      });


      for(var i = 0;  i < particlesToCreate.fire; ++i){
        particleFire.create();
      }
      spec.particles.push(particleFire);
      for(var i = 0;  i < particlesToCreate.fire; ++i){
        particleRedFire.create();
      }

      for(var i = 0; i < particlesToCreate.smoke; ++i){
        particlesSmoke.create();
      }

      //spec.particles.push(particlesSmoke);
      spec.particles.push(particleRedFire);
      spec.particles.push(particleFire);
    }

    that.turnOnShield = function () {
      if(that.shields.on || that.shields.count <= 0) return;

      console.log('turnOnShield');
      that.shields.startTime = Date.now();
      that.shields.count--;
      that.shields.on = true;
      that.shields.hits = 0;
      that.shields.shieldWidth =0;
      ASTEROIDGAME.sounds.shieldOn();
      
     // $('#shield1').toggle(that.shields.count == 3);
      //$('#shield2').toggle(that.shields.count >= 2);
      //$('#shield3').toggle(that.shields.count >= 1);
      if(that.shields.count < 3){  $('#shield1').css('visibility', 'hidden');}

      if(that.shields.count <2 ){  $('#shield2').css('visibility', 'hidden');}

      if(that.shields.count <1 ){  $('#shield3').css('visibility', 'hidden');}

    }

    that.explode = function (quadrants, asteroids) {
      if(that.shields.on) {
        if(++that.shields.hits >= that.shields.HIT_MAX) that.shields.on = false;
        if(that.shields.count == 0)
          $('#id-shield-progress').hide();
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

      //$('#ship1').toggle(that.lives == 3);
      //$('#ship2').toggle(that.lives >= 2);
      //$('#ship3').toggle(that.lives >= 1);
      if(that.lives < 3){  $('#ship1').css('visibility', 'hidden');}

      if(that.lives <2 ){  $('#ship2').css('visibility', 'hidden');}

      if(that.lives <1 ){  $('#ship3').css('visibility', 'hidden');}

      return false;
    };
    that.hyperspace = function (elapsedTime, ship, quadrants, asteroids) {
      if(that.hyperAvailable){

        that.hyperAvailable= false;
        lastHyperspaceTime=0;
        $("#id-progress").css('width', '1px');
        ASTEROIDGAME.sounds.hyperspace();
        ASTEROIDGAME.graphics.explosions.hyperspace(ship.center);
        ship.respawn(quadrants, asteroids);
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
      if(lastHyperspaceTime >= HYPER_WAIT_TIME && !that.hyperAvailable) {
        that.hyperAvailable = true;
      }

      if(!that.hyperAvailable) {
        lastHyperspaceTime += elapsedTime;
        $("#id-progress").css('width', '' + (lastHyperspaceTime/HYPER_WAIT_TIME)*170 + 'px');
      }

      var shieldWidth = 170;
      if(that.shields.on) {
        shieldWidth *= 1 - (Date.now() - that.shields.startTime)/that.shields.LIFE_TIME;

        if ((that.shields.startTime + that.shields.LIFE_TIME < Date.now()) ) {
          that.shields.on = false;
          that.shields.removing = true;
          ASTEROIDGAME.sounds.shieldOff();
          if(that.shields.count == 0)
            $('#id-shield-progress').hide();
        }
      }
      $('#id-shield-progress').css('width', '' + shieldWidth + 'px');

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

      context.translate(that.center.x, that.center.y);
      context.rotate(that.rotation);
      context.translate(-that.center.x, -that.center.y);

      context.drawImage(
        that.image,
        that.center.x - that.width/2,
        that.center.y - that.height/2,
        that.width, that.height
      );

      // Draw Shield
      if(that.shields.on || that.shields.removing) {
        var shieldColor = that.shields.count == 0 ? 'red' : 'blue';

        context.drawImage(
          that.shields.images[shieldColor],
          that.center.x - that.shields.width/2,
          that.center.y - that.shields.width/2,
          that.shields.width, that.shields.height
        );
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
