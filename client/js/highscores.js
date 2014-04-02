/*jslint browser: true, white: true, plusplus: true */
/*global ASTEROIDGAME */

ASTEROIDGAME.screens['high-scores'] = (function() {
  'use strict';

  function initialize() {

  }

  function run() {
    //
    // empty high score display
    $.ajax({
      url: '/scores',
      type: 'GET',
      success: function(result){
                  ASTEROIDGAME.highScores = JSON.parse(result);
                  console.log(ASTEROIDGAME.highScores);

                  $('.showScores').empty();

                  //show top 10 high scores
                  var totalScores = ASTEROIDGAME.highScores.length < 10 ? ASTEROIDGAME.highScores.length : 10;
                  for(var i=0; i<totalScores; ++i){
                    var S = ASTEROIDGAME.highScores[i];
                    $('.showScores').append('<h2>' + S.name + ": " + S.score + "</h2>");
                  }
              }
    });

    
  }

  return {
    initialize : initialize,
    run : run
  };
}());
