var db = require('../config/connection');
var config = require('../config/general');
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
const saltRounds = 20;

module.exports = {
    //register a new user
    register(req, res, next) {
        //get post values
        var email = req.body.email;
        var name = req.body.name;
        var password = req.body.password;
        var secret_key = req.body.secret_key;

        if(validation(email, name, password, secret_key)){
            if(getUser(email).lenght != 0){
                res.status(400).json({
                    status:{
                        message: 'Email al in gebruik'
                    }
                }).end();
            }
            else{
                saveNewUser(name, email, password);
            }
        }
    },
    //validate login + web token creation
    login(req, res, next) {
        var user = getUser(email);
        var password = req.body.password;
        bcrypt.compare(password, user.password, function(err, res) {
            if(!ress){
                res.status(400).json({
                    status:{
                        message: 'Wachtwoord ongeldig'
                    }
                }).end();
            }
            else{
                const payload ={
                    exp: moment().add(10,'days').unix(),
                    iat: moment().unix(),
                    sub: user.name
                };
                var token = jwt.encode(payload, settings.secret_key);
                res.status(200).json({
                    status:{
                        message:"Gebruiker ingelogd",
                        token: token
                    }
                }).end();
            }
        });
    },
};


//gebruiker ophalen
function getUser(email){
    db.query('select * from users where email = ?',email , function(error, rows){
        if(error){
            console.log(error.stack);
            res.status(500).json({
                status:{
                   message: 'Er ging iets mis, probeer het opnieuw'
                }
            }).end();
        }
        else{
            if(rows.count() > 1){
                res.status(400).json({
                    status:{
                        message: 'Gebruiker niet gevonden'
                    }
                }).end();
            }  
            else{
                return rows[0];
            }
        }
    });
}
//saven new user to the db
function saveNewUser(name, email, password){
    bcrypt.hash(password, saltRounds, function(err, hash) {
        var values ={
            name: name,
            email: email,
            password: hash
        };
        db.query('INSERT INTO users (name, email, password) VALUES ?', [values], function(error){
            if(error){
                console.log(error.stack);
                res.status(500).json({
                    status:{
                       message: 'Er ging iets mis, probeer het opnieuw'
                    }
                }).end();
            }
            else{
                res.status(200).json({
                    status:{
                       message: 'Gebruiker geregistreerd'
                    }
                }).end();
            }
        });
    });
}

//values validation
function validation(email, name, password, secret_key){
    var emailcheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    //name check
    if(name.legnth < 3){
        res.status(400).json({
            status:{
                message: 'Naam ongeldig'
            }
        }).end();
    }
    //password validation
    if(!(password.length >= 6 && /\d/.test(password) && /\W/.test(password))){
        res.status(400).json({
            status:{
                message: 'Gebruik een sterk wachtwoord.'
            }
        }).end();
    }
    //secret key validation
    if(!secret_key.equals('12345')){
        res.status(400).json({
            status:{
                message: 'Geheime sleutel ongeldig'
            }
        }).end();
    }
    //email validation
    if(!emailcheck.test(email)){
        res.status(400).json({
            status:{
                message: 'Emailadres ongeldig'
            }
        }).end();
    }
    //end validation
    return true;
}