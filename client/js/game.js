/*jslint browser: true, white: true, plusplus: true */
/*global $, ASTEROIDGAME */

// ------------------------------------------------------------------
//
// This is the game object.  Everything about the game is located in
// this object.
//
// ------------------------------------------------------------------

ASTEROIDGAME.game = (function() {
  'use strict';

  function showScreen(id) {
    //hide all screens
    for(var s in ASTEROIDGAME.screens){
      var className = '.' + s;
      //console.log(className);
      $(className).css('display','none');
    }
    //display selected screen

    if(ASTEROIDGAME.screens.hasOwnProperty(id)){

      if(id =='game-play' || id == 'AI'){
        $('.main').css('display','none');
        if(id=='AI'){
          $('.game-play').css('display','block');
        }
      }
      else{
        $('.main').css('display','block');

      }

      var className = '.' + id;
      //console.log(className);
      $(className).css('display','block');

      ASTEROIDGAME.screens[id].run();
    }

  }

  //------------------------------------------------------------------
  //
  // This function performs the one-time game initialization.
  //
  //------------------------------------------------------------------
  function initialize() {
    $('body').click(function(e){

    });
    //reset the AI delay time - after 10 seconds then start AI
    $('*').on('keydown mousedown mousemove', function(e){
      //console.log(" ** reset AI **");
        ASTEROIDGAME.lastEventTime = performance.now();
        ASTEROIDGAME.screens['AI'].cancel();
    });
   //get high scores from server
    $('#id-new-game').click(function(e){
      ASTEROIDGAME.screens['main-menu'].cancel('game-play');
    });
      
    $('#id-high-scores').click(show('high-scores'));
    $('#id-controls').click(show('controls'));
    $('#id-about').click(show('about'));

    $('#id-quit').click(function (e){
      ASTEROIDGAME.screens['game-play'].cancel();
    });

    function show(screen) {
      return function (e) {
        ASTEROIDGAME.game.showScreen(screen);
      };
    }

    $.ajax({
      url: '/scores',
      type: 'GET',
      success: function(result){
                  ASTEROIDGAME.highScores = JSON.parse(result);
                  console.log(ASTEROIDGAME.highScores);

                  for(var i in ASTEROIDGAME.highScores){
                    var S = ASTEROIDGAME.highScores[i];
                    $('.showScores').append('<h2>' + S.name + ": " + S.score + "</h2>");
                  }
              }
    });  
    var screen = null;
    //
    // Go through each of the screens and tell them to initialize
    for (screen in ASTEROIDGAME.screens) {
      if (ASTEROIDGAME.screens.hasOwnProperty(screen)) {
        ASTEROIDGAME.screens[screen].initialize();
      }
    }

    //
    // Make the main-menu screen the active one
    showScreen('main-menu');
  }

  return {
    initialize : initialize,
    showScreen : showScreen
  };
}());
