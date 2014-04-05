/*jslint browser: true, white: true, plusplus: true */
/*global ASTEROIDGAME */

ASTEROIDGAME.screens['game-over'] = (function() {
  'use strict';

  function initialize() {
    
  }

  function run() {
    //

    $('#final-score').html("Your Score: " + ASTEROIDGAME.playerScore);
    
    //if high scores isn't full then add the score as long as its greater than 0
    if(ASTEROIDGAME.highScores.length < 10 && ASTEROIDGAME.playerScore > 0 ){
      getHighScore(ASTEROIDGAME.playerScore);
    }
    else{
      //if high scores is full then check if the new high score is greater than the smallest high score
      var lowestScore = ASTEROIDGAME.highScores.pop();
      if(lowestScore.score < ASTEROIDGAME.playerScore){
        getHighScore(ASTEROIDGAME.playerScore);
      }
      else{//new score wasn't higher so push lowest score back on 
        ASTEROIDGAME.highScores.push(lowestScore);
      }
    }

  }
  function getHighScore(score){

    $('#highScoreName').val(''),
    $(".enterName").css('display','block');

    //unbind click so can't double click and add score twice
    $('#id-name').unbind('click').click(function(e){
      console.log("clicked submit name");

      //add new score to high scores array
      ASTEROIDGAME.highScores.push({
        name: $('#highScoreName').val(),
        score: score
      });

      //save scores to the server
      ASTEROIDGAME.highScores.sort(function(a,b){return b.score-a.score });
      $.ajax({
        url: '/scores',
        type: 'POST',
        data: {scores: JSON.stringify(ASTEROIDGAME.highScores)},
        success: function(result){
          console.log(result);
        }
      });
      //hide high score entry input and submit button
      $(".enterName").css('display','none');

      ASTEROIDGAME.game.showScreen('high-scores');

    });
    
  }
  return {
    initialize : initialize,
    run : run
  };
}());
