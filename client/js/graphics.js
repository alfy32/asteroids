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
    if(center.x + dimensions.width < 0) center.x = canvas.width + dimensions.width;
    if(center.y + dimensions.height < 0) center.y = canvas.height + dimensions.height;

    if(center.x - dimensions.width > canvas.width) center.x = -dimensions.width;
    if(center.y - dimensions.height > canvas.height) center.y = -dimensions.height;
  }

  return {
    clear : clear,
    resize: resize,
    wrapAround: wrapAround
  };
}());
