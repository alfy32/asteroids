/*global CanvasRenderingContext2D, ASTEROIDGAME */

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

  function wrapAround(center, dimensions) {
    if(center.x + dimensions.width/2 < 0) center.x = canvas.width + dimensions.width/2;
    if(center.y + dimensions.height/2 < 0) center.y = canvas.height + dimensions.height/2;

    if(center.x - dimensions.width/2 > canvas.width) center.x = -dimensions.width/2;
    if(center.y - dimensions.height/2 > canvas.height) center.y = -dimensions.height/2;
  }

  return {
    clear : clear,
    resize: resize,
    wrapAround: wrapAround
  };
}());
