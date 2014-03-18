/* jshint node:true */
'use strict';

var express = require('express');
var config  = require('config');
var http    = require('http');
var fs      = require('fs');

var app = express();

app.set('port', process.argv[2] || config.port);

// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static('client'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// *************** Gets the routing scripts ***********

fs.readdirSync(__dirname + '/routes').forEach(function (file) {
  require('./routes/' + file)(app);
});

// ******************* Start the Server ***************

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port') +
              ' in environment ' + app.get('env'));
});