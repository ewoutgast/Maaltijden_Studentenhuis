// Dependencies
var express = require('express');
var routes = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var jwt = require('jwt-simple');
var moment = require('moment');

// Config
var settings = require('../config/general');

// Controllers
var meal = require('../controller/meal.controller');
var newMeal = require('../controller/newMeal.controller');
var leaveMeal = require('../controller/leaveMeal.controller');
var joinMeal = require('../controller/joinMeal.controller');
var account = require('../controller/account.controller');

module.exports = {}

// Decode token
routes.all(new RegExp("[^(\/login|/register)]"), function(req, res, next) {
	var token = (req.header("X-Access-Token")) || '';
	decodeToken(token, res, function(payload){
		req.user = payload.sub.user;
		next();
	});
});

// All routes
routes.use('*', function (req, res, next) {
    res.contentType('application/json'); // Add content type
    next();
});

routes.get('/meals', meal.getAll);
routes.get('/meal/:id', meal.getById);
routes.get('/meal/img/:imgName', meal.getImage);

routes.post('/meal/leave', leaveMeal.leaveMealById);

routes.post('/meal/join', joinMeal.joinMealById);
routes.post('/meal/new', upload.single('newMealImg'), newMeal.newMeal);

routes.post('/register', account.register);
routes.post('/login',account.login);

module.exports = routes;

function decodeToken(token, res, cb) {
	try {
		const payload = jwt.decode(token, settings.secret_key);
		const now = moment().unix();

		if(now > payload.exp){
			console.log('Token has expired');
			res.status(400).json({
                    status:{
                       message: 'Niet ingelogd'
                    }
             }).end();
		}
		else{
			cb(payload);
		}
	}
	catch(err){
		res.status(400).json({
                status:{
                   message: 'Niet ingelogd'
                }
         }).end();
	}
}