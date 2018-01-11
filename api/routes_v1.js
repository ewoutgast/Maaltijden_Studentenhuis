var express = require('express');
var routes = express.Router();

module.exports = {}

// routes
app.use('*', function (req, res, next) {
    res.contentType('application/json'); // Add content type
    next();
});

module.exports = routes;