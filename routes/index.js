
/*
 * GET home page.
 */

app = require('../app');

app.get('/', function(req, res){
	res.render('index.html');
})

app.get('/playGame', function(req, res){
	res.render('playGame.html');
})