// Dependencies
// var http = require('http');
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');


var routes_v1 = require('./api/example_v1.js');

// Start app
var app = express();

// Parse input/output
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

// Log HTTP requests
app.use(logger('dev'));

// Routes
app.get('/', function(req, res){
    res.status(200);
    res.send('Hello World!');
});
app.use('/api/v1', routes_v1);


// Listing to port
app.listen(process.env.PORT || 4015, function(){
	console.log('Example app listening on port 4015!')
});

module.exports = app;