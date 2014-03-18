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

  function Ship(spec) {
    var that = {};

    that.rotateRight = function(elapsedTime) {
      spec.rotation += spec.rotateRate * (elapsedTime / 1000);
    };

    that.rotateLeft = function(elapsedTime) {
      spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
    };

    that.moveLeft = function(elapsedTime) {
      spec.center.x -= spec.moveRate * (elapsedTime / 1000);
      if(spec.center.x<0){
        spec.center.x = canvas.width;
      }
    };

    that.moveRight = function(elapsedTime) {
      spec.center.x += spec.moveRate * (elapsedTime / 1000);
      if(spec.center.x>canvas.width){
        spec.center.x = 0;
      }
    };

    that.moveUp = function(elapsedTime) {
      spec.center.y -= spec.moveRate * (elapsedTime / 1000);
      if(spec.center.y<0){
        spec.center.y = canvas.height;
      }

    };

    that.moveDown = function(elapsedTime) {
      spec.center.y += spec.moveRate * (elapsedTime / 1000);
      if(spec.center.y>canvas.height){
        spec.center.y = 0;
      }
    };

    that.moveTo = function(center) {
      spec.center = center;
    };

    that.draw = function() {
      context.save();
      var size = canvas.width*0.08;
      context.translate(spec.center.x, spec.center.y);
      context.rotate(spec.rotation);
      context.translate(-spec.center.x, -spec.center.y);

      context.drawImage(
        spec.image,
        spec.center.x - size/2,
        spec.center.y - size/2,
        size, size);

      context.restore();
    };

    return that;
  }


  return {
    clear : clear,
    Ship : Ship,
    resize: resize
  };
}());
