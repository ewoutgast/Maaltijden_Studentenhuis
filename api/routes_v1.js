// Dependencies
var express = require('express');
var routes = express.Router();
var jwt = require('jwt-simple');
var settings = require('../config/general');
var moment = require('moment');
// Controllers
var meal = require('../controller/meal.controller');
var account = require('../controller/account.controller');

routes.all(new RegExp("[^(\/login|/register)]"),function(req,res,next){
	var token = (req.header("X-Acces-Token"))||'';
	decodeToken(token, res, function(){
		next();
	});
});
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


function decodeToken(token, res, cb){
	try{
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
			cb();
		}
	}
	catch(err){
		console.log(err);
		res.status(400).json({
                status:{
                   message: 'Niet ingelogd'
                }
         }).end();
	}
}