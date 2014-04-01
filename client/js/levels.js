
ASTEROIDGAME.levels = (function(){

    var that = {
      currentLevel: 1,
      startAsteroids: 4
    }

    that.create = function(asteroids, amount){
      
      for(var i=0; i<amount; ++i){
        asteroids.create('large');
      }
    }

    that.update = function(asteroids){

      that.currentLevel++;
      that.startAsteroids++;
      that.create(asteroids, that.startAsteroids);
    }

    
    that.reset = function(){
      that.currentLevel=1;
      that.startAsteroids=4;
    }

    that.render = function(){
      $('#level').html('Level:'+ that.currentLevel);
    }

return that;

}());