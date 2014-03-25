/*global ASTEROIDGAME */

ASTEROIDGAME.graphics.Lasers = (function() {
  'use strict';

  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');

  function Lasers(spec){
    var that = {};
    that.totalTime = 0;

    that.list = spec.activeLasers;

    that.create = function(elapsedTime, ship){
      if(that.totalTime > 75){

        ASTEROIDGAME.sounds.shoot();

        that.totalTime =0;
        that.lastTimeStamp = elapsedTime;
        spec.activeLasers.push({
          image : ASTEROIDGAME.images['/img/laser.png'],
          center : {  x : ship.center.x-(Math.cos(ship.rotation)*((canvas.width*0.06)/2)),
                      y : ship.center.y-(Math.sin(ship.rotation)*((canvas.width*0.06)/2))},
          width : 30, height : 2,
          direction : ship.rotation,
          moveRate : 800,     // pixels per second
        });
      }
      else{
        that.totalTime+=elapsedTime;
      }
    };

    that.update = function(elapsedTime){

      for(var L in spec.activeLasers){
        var laser = spec.activeLasers[L];
        laser.center.x -= Math.cos(laser.direction) * laser.moveRate * (elapsedTime / 1000);
        laser.center.y -= Math.sin(laser.direction) * laser.moveRate * (elapsedTime / 1000);

        if(laser.center.y<0 || laser.center.y>canvas.height || laser.center.x<0 || laser.center.x>canvas.width){
          spec.activeLasers.splice(L, 1);
        }

      }
    };

    that.draw = function(){

      var sizeX = canvas.width*0.02;
      var sizeY = canvas.width*0.002;
      for(var L in spec.activeLasers){
        var laser = spec.activeLasers[L];
        context.save();
        context.translate(laser.center.x , laser.center.y );
        context.rotate(laser.direction);
        context.translate(-laser.center.x , -laser.center.y );
        context.drawImage(
          laser.image,
          laser.center.x - sizeX/2,
          laser.center.y - sizeY/2,
          sizeX, sizeY
        );

        context.beginPath();
        context.arc(laser.center.x, laser.center.y, laser.width/2, 0, 2*Math.PI);
        context.stroke();

        context.restore();
      }
    };

    return that;
  }

  return Lasers;
}());
