/*global ASTEROIDGAME */

ASTEROIDGAME.collision = (function() {
  'use strict';

  function circleCircle(circle1, circle2, cb) {
    var x = circle1.center.x - circle2.center.x;
    var y = circle1.center.y - circle2.center.y;

    var distance = Math.sqrt(x*x + y*y);

    var radius1 = circle1.width/2;
    var radius2 = circle2.width/2;

    if(distance < radius1 + radius2) {
      if(cb) cb(circle1, circle2);
      return true;
    }
    else return false;
  }

  function circlePoint(circle, point, cb) {
    var x = circle.center.x - point.center.x;
    var y = circle.center.y - point.center.y;

    var distance = Math.sqrt(x*x + y*y);

    var radius = circle.width/2;

    if(distance < radius) {
      if(cb) cb(circle, point);
      return true;
    }
    else return false;
  }

  function circleCircles(circle, circles, cb) {
    for(var i in circles) {
      if(circleCircle(circle, circles[i], cb)) {
        return true;
      }
    }
    return false;
  }

  function circlesCircles(circles1, circles2, cb) {
    for(var item1 in circles1) {
      for(var item2 in circles2) {
        if(circleCircle(circles1[item1], circles2[item2], cb)) {
          return true;
        }
      }
    }
    return false;
  }

  function circlesPoints(circles, points, cb) {
    for(var i in circles) {
      for(var j in points) {
        if(circlePoint(circles[i], points[j], cb)) {
          return true;
        }
      }
    }
    return false;
  }

  function circlesPoint(circles, point, cb) {
    for(var i in circles) {
      if(circlePoint(circles[i], point, cb)) {
        return true;
      }
    }
    return false;
  }

  function circlePoints(circle, points, cb) {
    for(var i in points) {
      if(circlePoint(circle, points[i], cb)) {
        return true;
      }
    }
    return false;
  }

  return {
    circleCircle: circleCircle,
    circlePoint: circlePoint,
    circleCircles: circleCircles,
    circlesCircles: circlesCircles,
    circlesPoints: circlesPoints,
    circlesPoint: circlesPoint,
    circlePoints: circlePoints
  };
}());