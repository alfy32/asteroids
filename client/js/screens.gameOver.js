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
    $("#nav").css('display','none');
    $('#highScoreName').val(''),
    $(".enterName").css('display','block');
    $('#highScoreName').focus();
    //unbind click so can't double click and add score twice

    $('.enterName').unbind('keyup').keyup(function(e){

      if(e.which==13){
         console.log("Enter Pressed to submit name" + e.which);
        //add new score to high scores array
        addHighScore(score);

      }
    });
    $('#id-name').unbind('click').click(function(e){
      console.log("clicked submit name");
        addHighScore(score);
    });
  }
  function addHighScore(score){

      if($('#highScoreName').val()!==''){
        //add new score to high scores array
        ASTEROIDGAME.highScores.push({
          name: $('#highScoreName').val(),
          score: score
        });

        //save scores to the server
          ASTEROIDGAME.highScores.sort(function(a,b){return b.score-a.score });
          if(ASTEROIDGAME.highScores.length > 10){
            ASTEROIDGAME.highScores.length = 10;
          }
        $.ajax({
          url: '/v1/high-scores?name=' + $('#highScoreName').val() + "&score=" + score,
          type: 'POST',
          success: function(result){
            console.log("Added high scores to server: " + result);
            //hide high score entry input and submit button
             $(".enterName").css('display','none');
             $("#nav").css('display','block');
              ASTEROIDGAME.game.showScreen('high-scores');
          }
        });
        
      }
  }
  return {
    initialize : initialize,
    run : run
  };
}());
