/*jslint browser: true, white: true, plusplus: true */
/*global ASTEROIDGAME */

ASTEROIDGAME.screens['controls'] = (function() {
  'use strict';
  var that = {};
  that.controls = {
    forward: KeyEvent.DOM_VK_W,
    left: KeyEvent.DOM_VK_A,
    right: KeyEvent.DOM_VK_D,
    shoot: KeyEvent.DOM_VK_B,
    hyperspace: KeyEvent.DOM_VK_S
  }
  function initialize() {
    $('#forward').val(String.fromCharCode(that.controls.forward));
    $('#right').val(String.fromCharCode(that.controls.right));
    $('#left').val(String.fromCharCode(that.controls.left));
    $('#shoot').val(String.fromCharCode(that.controls.shoot));
    $('#hyperspace').val(String.fromCharCode(that.controls.hyperspace));
  }
  function getControls(){
    return that.controls;
  }
  function run() {
    $('#forward').keyup(function(e){
      that.controls.forward = e.keyCode;
    })
    $('#right').keyup(function(e){
      that.controls.right = e.keyCode;
    })
    $('#left').keyup(function(e){
      that.controls.left = e.keyCode;
    })
    $('#shoot').keyup(function(e){
      that.controls.shoot = e.keyCode;
      
    })
    $('#hyperspace').keyup(function(e){
      that.controls.hyperspace = e.keyCode;
      
    })
    $('#forward').keypress(function(e){
      $('#forward').val(String.fromCharCode(e.which));
    })
    $('#right').keypress(function(e){
      $('#right').val(String.fromCharCode(e.which));
    })
    $('#left').keypress(function(e){
      $('#left').val(String.fromCharCode(e.which));
    })
    $('#shoot').keypress(function(e){
      $('#shoot').val(String.fromCharCode(e.which));
    })
    $('#hyperspace').keypress(function(e){
      $('#hyperspace').val(String.fromCharCode(e.which));
    })
    //$('#right').val(String.fromCharCode(that.controls.right));
    //$('#left').val(String.fromCharCode(that.controls.left));
    //$('#shoot').val(String.fromCharCode(that.controls.shoot));
    //$('#hyperspace').val(String.fromCharCode(that.controls.hyperspace));
    //
    // I know this is empty, there isn't anything to do.
  }

  return {
    initialize : initialize,
    run : run,
    controls: getControls
  };
}());
