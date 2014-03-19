/*jslint browser: true, white: true */
/*global CanvasRenderingContext2D, ASTEROIDGAME */

// ------------------------------------------------------------------
//
//
// ------------------------------------------------------------------

ASTEROIDGAME.graphics = (function() {
  'use strict';

  var canvas = document.getElementById('canvas-main'), 
    context = canvas.getContext('2d');

  //
  // Place a 'clear' function on the Canvas prototype, this makes it a part
  // of the canvas, rather than making a function that calls and does it.
  CanvasRenderingContext2D.prototype.clear = function() {
    this.save();
    this.setTransform(1, 0, 0, 1, 0, 0);
    this.clearRect(0, 0, canvas.width, canvas.height);
    this.restore();
  };

  function clear() {
    context.clear();
  }

  function resize() {

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

  function Lasers(spec){
    var that = {};

    that.create = function(elapsedTime, ship){
      spec.activeLasers.push({
        image : ASTEROIDGAME.images['/img/laser.png'],
        center : { x : ship.centerX, y : ship.centerY},
        width : 30, height : 2,
        direction : ship.rotation,
        moveRate : 800,     // pixels per second 
      });
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
        context.restore();
      }
    };

    return that;
  }

  function Ship(spec) {
    var that = {};
    that.centerX = spec.center.x;
    that.centerY = spec.center.y;
    that.direction = spec.direction;
    that.rotation = spec.rotation;
    that.moving =false,
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
    }

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
    };

    return that;
  }


  return {
    clear : clear,
    Ship : Ship,
    resize: resize,
    Lasers: Lasers
  };
}());
