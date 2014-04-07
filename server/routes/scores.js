/* jshint node: true*/
'use strict';
var fs = require('fs');

module.exports = function(app) {

  app.get('/scores', getScores);
  app.post('/scores', postScores);

  //////////////// V1 //////////////////////
  app.get('/v1/high-scores', getScoresV1);
  app.get('/v1/high-scores/:id', getScoreV1);
  app.post('/v1/high-scores', postScoreV1); // requires params ?name=<name>&score=<score>
  //////////////////////////////////////////
};

function postScores(req, res){
  //console.log("inside postScores" + req.body.scores);

  fs.writeFile('highScores.json', req.body.scores, function (err) {
    if (err){
      console.log(err);
      res.end('File could not be saved');
    }
    else{
      res.end('File has been saved');
    }
  });

}

function getScores(req, res) {
  //console.log("inside getScores" + req.query.scores);

  fs.readFile('highScores.json', function (err, data) {
    if (err){
      console.log(err);
      if(err.errno==34){
        res.send('No such file exist');
      }

    }
    else{
      res.send(data);
    }
  });

}

/////////////// V1 functions ///////////////////////////////

function getScoresV1(req, res) {
  readFile(res, function (scores) {
    res.send({
      success: true,
      scores: scores
    });
  });
}

function getScoreV1(req, res) {
  var id = req.params.id;
  if(id < 0) return _notFound(res);

  readFile(res, function (scores) {
    if(id >= scores.length) return _notFound(res);

    res.send({
      success: true,
      score: scores[id]
    });
  });
}

function postScoreV1(req, res) {
  var name = req.query.name;
  var score = Number(req.query.score);

  if(isNaN(score))
    return _badRequest(res, 'The score must be a number.');

  if(!name || !score)
    return _badRequest(res, 'You must have a score and a name.');

  readFile(res, function (scores) {
    scores.push({
      name: name,
      score: score
    });

    writeFile(res, scores, function () {
      res.send({
        success: true
      });
    });
  });
}

function _fail(res, err) {
  res.send({
    success: false,
    err: err
  });
}

function _notFound(res) {
  res.status(404).send('<h3>404 Not Found</h3>');
}

function _badRequest(res, err) {
  res.status(400).send('<h3>400 Bad Request</h3>' + '<p>Error: ' + err + '</p>');
}

function readFile(res, cb) {
  fs.readFile('highScores.json', function (err, data) {
    if (err) {
      console.log(err);

      if(err.errno == 34) _fail(res, 'No such file exist');
    }
    else cb(JSON.parse(data));
  });
}

function writeFile(res, scores, cb) {
  if(typeof scores == 'object') scores = JSON.stringify(scores);

  fs.writeFile('highScores.json', scores, function (err) {
    if (err){
      console.log(err);
      _fail(res, 'File could not be saved. Error: ' + err);
    }
    else{
      cb();
    }
  });
}