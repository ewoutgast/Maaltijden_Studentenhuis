// Dependencies
// var http = require('http');
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

// Config files
var config = require('./config/general');
// var db = require('./config/db');

// Start app
var app = express();

// Parse input/output
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

// Log HTTP requests
app.use(logger('dev'));

// Routes
app.get('/', function(req, res) {
    res.status(200);
    res.send('Usages: api/v1/[url]');
});
app.use('/api/v1', './api/routes_v1.js');
app.use('*', function (req, res) {
	res.status(404).json({
        message: 'No matching endnode!'
    }).end();
});

// Listing to port
app.listen(process.env.PORT || config.port, function() {
	console.log('Example app listening on port ' + config.port + '!')
});

module.exports = app;