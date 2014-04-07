//****account for mod of a negative number
function modFix(rotation){
  return ((rotation%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
}
ASTEROIDGAME.AiLogic = (function(){

    var left=KeyEvent.DOM_VK_LEFT,
        right=KeyEvent.DOM_VK_RIGHT,
        accelerate=KeyEvent.DOM_VK_UP,
        hyperspace=KeyEvent.DOM_VK_DOWN,
        shoot=KeyEvent.DOM_VK_SPACE,
        lastUpdateTime=0,
        stateAccelerate= false,
        stateRotateLeft= false,
        stateRotateRight= false,
        stateShoot=false,
        targetAngle = 0,
        currentAngle = 180;
        currentDirection = 'right';

    function update(elapsedTime, asteroids, ufo, ship, lasers, keyBoard){
        
        currentAngle = modFix(ship.rotation)* (180/Math.PI); //convert radians to degrees
          //rotate to 270 degrees and fire 3 times
         
          //console.log(currentAngle+ " <= " + ((targetAngle+5)%360));
        //console.log(currentAngle+ ">= "+ ((targetAngle+355)%360));
        startShoot(keyBoard);

        //check if angle is going to be crossing between 0 and 360
        if(targetAngle>355 || targetAngle <5){
          if(currentAngle<=((targetAngle+4)%360) || currentAngle>=((targetAngle+356)%360)){
            stopRotation(keyBoard);
          }
        }

        else if(currentAngle<=targetAngle+4 && currentAngle>=targetAngle-4){
            stopRotation(keyBoard);
          
        }
        else{
          //choose direction
          if(currentDirection == 'right'){
            keyBoard.keyRelease(left);
            startRight(keyBoard);  
          }
          else{
            keyBoard.keyRelease(right);
            startLeft(keyBoard);
          }
        }       
        if(lastUpdateTime> 1000){
          lastUpdateTime=0;
          //change direction
          //targetAngle = Random.nextRange(0,359)
          findClosestAsteroid(asteroids, ship);
          var dir = Random.nextRange(0,99);
          if(dir<50){currentDirection ='right'}
          else{currentDirection = 'left'}
          //targetAngle = Random.nextRange(0,359)
          //console.log(targetAngle);
        }
        else
        {
          lastUpdateTime+=elapsedTime;
        }

    }
    function startRight(keyBoard){

      if(!stateRotateRight){
        keyBoard.keyPress(right);
        stateRotateRight=true;
      } 
    }
    function startLeft(keyBoard){
      if(!stateRotateLeft){
        keyBoard.keyPress(left);
        stateRotateLeft=true;
      } 
    }
    function stopRotation(keyBoard){
      if(stateRotateRight){
        keyBoard.keyRelease(right);
        stateRotateRight=false;
      }
      if(stateRotateLeft){
        keyBoard.keyRelease(left);
        stateRotateLeft=false;
      }
    }
    function startAccelerate(keyBoard){
      keyBoard.keyPress(accelerate);
    }
    function startAccelerate(keyBoard){
      keyBoard.keyRelease(accelerate);
    }

    function startShoot(keyBoard){
      if(!stateShoot){
        keyBoard.keyPress(shoot);
        stateShoot = true;
      }
    }
    function stopShoot(keyBoard){
      if(stateShoot){
        keyBoard.keyRelease(shoot);
        stateShoot = false;
      }
    }
    function reset(){
      lastUpdateTime=0,
      stateAccelerate= false,
      stateRotateLeft= false,
      stateRotateRight= false,
      stateShoot=false,
      targetAngle = 90,
      currentAngle = 180;
      currentDirection = 'right';
    }
    function findClosestAsteroid(asteroids, ship){
      if(asteroids.list.length>0){
        var closestAsteroid = asteroids.list[0];
        var minDist = 3000;
          for(a in asteroids.list){
            asteroid = asteroids.list[a];
            asteroid.AiTarget = false;
            var aCenterX = asteroid.center.x;
            var aCenterY = asteroid.center.y;
            if(aCenterX <0){
              aCenterX=0;
            }
            if(aCenterY <0){
              aCenterY=0;
            }
            var dist = Math.sqrt(Math.pow((ship.center.x-aCenterX),2),Math.pow((ship.center.y-aCenterY),2));
            if(dist<minDist){
              minDist = dist;
              closestAsteroid = asteroid;
            }
          }
          closestAsteroid.AiTarget = true;
          targetAngle=Math.atan2(closestAsteroid.center.x - ship.center.x, ship.center.y - closestAsteroid.center.y);

          console.log('target: ' + targetAngle);
          targetAngle= modFix(targetAngle) * (180/Math.PI);
          //console.log(minDist + " -- " + closestAsteroid.center.x + ":" + closestAsteroid.center.y)
          console.log('new target: ' + targetAngle);
          /*if(currentAngle-targetAngle > 0){
            currentDirection = 'left';
          }
          else{
            currentDirection='right';
          }
          */
      }
    }
  return {
    update: update, 
    reset: reset
  }
})();