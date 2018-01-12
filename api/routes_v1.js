// Dependencies
var express = require('express');
var routes = express.Router();

// Controllers
var meal = require('../controller/meal.controller');

module.exports = {}

// routes
routes.use('*', function (req, res, next) {
    res.contentType('application/json'); // Add content type
    next();
});

routes.get('/meals', meal.getAll);
routes.get('/meal/:id', meal.getById);

routes.post('/new_meal', meal.newMeal);

module.exports = routes;