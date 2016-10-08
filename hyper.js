/**
 *
 */

var express = require('express');
var db = require('./model/db');

var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json({limit : '500kb'}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/public', express.static(__dirname + '/public'));
var controller = require('./controller/wiz-controller')(app);
app.listen(3000, function() {
	console.log('Server running at http://localhost:3000...');
});
