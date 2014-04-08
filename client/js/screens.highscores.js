/*jslint browser: true, white: true, plusplus: true */
/*global ASTEROIDGAME */

ASTEROIDGAME.screens['high-scores'] = (function() {
  'use strict';

  function initialize() {

  }

  function run() {
    //
    // empty high score display

    ASTEROIDGAME.graphics.resize();
    $.ajax({
      url: '/v1/high-scores/',
      type: 'GET',
      success: function(result){
                  ASTEROIDGAME.highScores = result.scores;
                  console.log("show high score" + ASTEROIDGAME.highScores);

                  $('.showScores').empty();
                  ASTEROIDGAME.highScores.sort(function(a,b){return b.score-a.score });
                  if(ASTEROIDGAME.highScores.length > 10){
                    ASTEROIDGAME.highScores.length = 10;
                  }
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
