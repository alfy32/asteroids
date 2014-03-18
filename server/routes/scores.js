/* jshint node: true*/
'use strict';

module.exports = function(app) {
  app.get('/scores', getScores);
};

function getScores(req, res) {

  res.send({
    success: true,
    scores: 'Put Scores Here.'
  });
}