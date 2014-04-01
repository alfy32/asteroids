/* jshint node: true*/
'use strict';
var fs      = require('fs');

module.exports = function(app) {
  app.get('/scores', getScores);
  app.post('/scores', postScores);
};

function postScores(req, res){
  console.log("inside postScores" + req.body.scores);

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
  console.log("inside getScores" + req.query.scores);

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
  /*
  res.send({
    success: true,
    scores: 'Put Scores Here.'
  });
*/

