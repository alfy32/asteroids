
ASTEROIDGAME.quadrants = (function(){
  'use strict';
  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');

  var populations ={
    locLeastOuter: 0, 
    locLeastInner: 0, 
    locMostOuter: 0,
    locMostInner: 0
  }

  var lastUpdateTime =0;
  var that={};
  that.quads = [];

  that.create = function(){

    //create quadrants
    var width = Math.floor(window.innerWidth/2);
    var height = Math.floor(window.innerHeight/2)
    that.quads = createQuads(0,0,width, height);
    for(var q in that.quads){
      that.quads[q].innerQuads = createQuads(that.quads[q].xStart, that.quads[q].yStart, width/2, height/2)
    }
    
   };
   function createQuads(xTopCorner, yTopCorner, width, height){
    var newQuads = []
    for(var i=0; i<2; ++i){
      for(var j=0; j<2; ++j){
        //console.log("height: " + height + " width: " + width + " xStart: " + j*width + " yStart: " + i*height);
        newQuads.push({
          width: width,
          height: height,
          xStart: j*width+xTopCorner,
          xEnd: j*width+width+xTopCorner,
          xCenter: j*width+xTopCorner+width/2,
          yStart: i*height+yTopCorner,
          yEnd: i*height+height+yTopCorner,
          yCenter: i*height+yTopCorner + height/2,
          numOfObjects: 0
        });
      
      }
    }
    return newQuads;
   }

    that.update = function(elapsedTime, objects){
      if(lastUpdateTime > 10){
        lastUpdateTime =0;
        //calculate the area with the smallest population of objects and the largest pop
        var popOuter =  countObjects(that.quads, objects);
        populations.locLeastOuter = popOuter.least;
        populations.locMostOuter = popOuter.most;

        var leastPopInner = countObjects(that.quads[popOuter.least].innerQuads,objects);  
        populations.locLeastInner = leastPopInner.least;

        var mostPopInner = countObjects(that.quads[popOuter.most].innerQuads,objects); 
        populations.locMostInner = mostPopInner.most;   

        if(leastPopInner.noObjectsInQuads){
          //pick the one furthest from the most populated Inner square
          var locFurthestFrom = 0;
          var largestDist = -3000;
          var mostPopSquare = that.quads[popOuter.most].innerQuads[mostPopInner.most];

          for(var num in that.quads[popOuter.least].innerQuads){
              var q = that.quads[popOuter.least].innerQuads[num];
              var dist = Math.sqrt(Math.pow(mostPopSquare.xCenter-q.xCenter, 2) + Math.pow(mostPopSquare.yCenter-q.yCenter,2));
              if(dist > largestDist){
                largestDist = dist;
                locFurthestFrom = num;
              }
          }
          populations.locLeastInner = locFurthestFrom;
        }
      }
      else{
        lastUpdateTime+=elapsedTime;
      }
    };
    function countObjects(quadras, objects){
       var fewestObjects = 3000;
       var mostObjects = -3000;
       var populated = {
                least: 0,
                most: 0,
                noObjectsInQuads: true
              }
   
        for(var q in quadras){
          var quad = quadras[q];
          quad.numOfObjects =0;

          //check how many objects are in the quad
          for(var o in objects){
            var x = objects[o].center.x;
            var y = objects[o].center.y;
            //console.log("update: " + "x: " + x + "y:" + y + "xStart: " + quad.xStart + " yStart: " + quad.yStart);
            if(x>quad.xStart && x <quad.xEnd && y > quad.yStart && y<quad.yEnd){
              quad.numOfObjects++;
              populated.noObjectsInQuads =false;
            }
          }
          //update location with fewest objects
          if(quad.numOfObjects<fewestObjects){
            fewestObjects = quad.numOfObjects;
            populated.least = q;
          }
          if(quad.numOfObjects>mostObjects){
            mostObjects = quad.numOfObjects;
            populated.most = q;
          }
        }
        
        return populated;
    }
    that.reset=function(){
      that.quads.length=0;
    }
    that.getLeastPopulated = function(){
      
      return that.quads[populations.locLeastOuter].innerQuads[populations.locLeastInner];
    };

    that.render = function(){
      var fill = 'rgba(255, 150, 50, .5)';
      var fill2 = 'rgba(185, 40, 250, .5)';
      var stroke = 'rgba(255, 0, 0, .5)';
      var fewestOutside = that.quads[populations.locLeastOuter].innerQuads;
      var mostOutside = that.quads[populations.locMostOuter].innerQuads
      /*
      for(var n in that.quads){
        var q = that.quads[n];
        //context.fillStyle = fill;
       // context.fillRect(q.xStart, q.yStart, q.width, q.height);
        
        context.strokeStyle = stroke;
        context.lineWidth =4;
        context.strokeRect(q.xStart, q.yStart, q.width, q.height);
      }

      
      for(var n in fewestOutside){
        var fOutside = fewestOutside[n];
        context.fillStyle = fill;
        context.fillRect(fOutside.xStart, fOutside.yStart, fOutside.width, fOutside.height);
        
        context.strokeStyle = stroke;
        context.lineWidth =4;
        context.strokeRect(fOutside.xStart, fOutside.yStart, fOutside.width, fOutside.height);
      }
      */
      //draw the area with the fewest objects
      var fewestInside = fewestOutside[populations.locLeastInner];
      context.fillStyle = stroke;
      context.fillRect(fewestInside.xStart, fewestInside.yStart, fewestInside.width, fewestInside.height);
      
      context.strokeStyle = fill;
      context.lineWidth =4;
      context.strokeRect(fewestInside.xStart, fewestInside.yStart, fewestInside.width, fewestInside.height);

      //draw the area with the most objects
      var mostInside = mostOutside[populations.locMostInner];
      context.fillStyle = fill2;
      context.fillRect(mostInside.xStart, mostInside.yStart, mostInside.width, mostInside.height);
      
      context.strokeStyle = stroke;
      context.lineWidth =4;
      context.strokeRect(mostInside.xStart, mostInside.yStart, mostInside.width, mostInside.height);

    };

    return that;

}());