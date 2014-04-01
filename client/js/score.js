

ASTEROIDGAME.score = (function(){
  
    var LG_ASTEROID = 20,
    MED_ASTEROID= 50,
    SM_ASTEROID= 100,
    LG_SAUCER= 200,
    SM_SAUCER= 1000;
    
    var that = {
      score: 0,
      prevLifeIncrease:0
    };

  that.update= function(type, object, ship){
    if(type=="asteroid"){
      if(object.size=="small"){
        that.score+=SM_ASTEROID;
      }
      if(object.size=="medium"){
        that.score+=MED_ASTEROID;
      }
      if(object.size=="large"){
        that.score+=LG_ASTEROID;
      }
    }

    if(type=="saucer"){
      if(object.size=="small"){
        that.score+=SM_SAUCER;
      }
      if(object.size=="large"){
        that.score+=LG_SAUCER;
      }
    }

    if(that.score-that.prevLifeIncrease>=10000){
      ship.lives++;
      that.prevLifeIncrease+=10000
    }
    ASTEROIDGAME.playerScore = that.score;
  };

  that.render = function(){
    $('#score').html("Score:" + that.score);
  };

  that.reset = function(){
    that.score=0;
  };

  return that;
}());