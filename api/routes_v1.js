// Dependencies
var express = require('express');
var routes = express.Router();

// Controllers
var meal = require('../controller/meal.controller');
var account = require('../controller/account.controller');


// routes
routes.use('*', function (req, res, next) {
    res.contentType('application/json'); // Add content type
    next();
});

routes.get('/meals', meal.getAll);
routes.get('/meal/:id', meal.getById);

routes.post('/register', account.register);
routes.post('/login',account.login);

module.exports = routes;