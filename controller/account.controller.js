var db = require('../config/connection');
var config = require('../config/general');
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var moment = require('moment');

const saltRounds = 10;

module.exports = {
    //register a new user
    register(req, res) {
        //get post values
        var email = req.body.email;
        var name = req.body.name;
        var password = req.body.password;
        var secret_key = req.body.secret_key;


        validation(email, name, password, secret_key, res, function(){
            getUser(email, res, function(user){
                if(user.length != 0){
                    res.status(400).json({
                        status:{
                            message: 'Email al in gebruik'
                        }
                    }).end();
                }else{
                    saveNewUser(name, email, password, res);
                }
            }); 
        });
    },
    //validate login + web token creation
    login(req, res) {
        var password = req.body.password;
        console.log(req.body.email);
        getUser(req.body.email ||'',res, function(user){
            if(user.length != 0 ){
                bcrypt.compare(password, user[0].password, function(err, check) {
                    if(check){
                        console.log(check);
                        const payload ={
                            exp: moment().add(10,'days').unix(),
                            iat: moment().unix(),
                            sub: user[0].name
                        };
                        var token = jwt.encode(payload, config.secret_key);
                        res.status(200).json({
                            status:{
                                message:"Gebruiker ingelogd",
                                token: token
                            }
                        }).end();
                    }
                    else{
                        console.log(check);
                        res.status(400).json({
                                status:{
                                    message: 'Wachtwoord ongeldig'
                                }
                        }).end();
                    }
                });
            }
            else{
                res.status(400).json({
                    status:{
                       message: 'Ongeldig emailadres'
                    }
                }).end();
            }

        });
         
    },
};
//gebruiker ophalen
function getUser(email, res, cb){
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
            if(rows.length > 1){
                res.status(400).json({
                    status:{
                       message: 'Ongeldig emailadres'
                    }
                }).end();
            }
            else{
                cb(rows);
            }
        }
    });
}
//saven new user to the db
function saveNewUser(name, email, password, res){
    bcrypt.hash(password, saltRounds, function(err, hash) {
        var values ={
            name: name,
            email: email,
            password: hash
        };
        db.query('INSERT INTO users set ?', [values], function(error){
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
function validation(email, name, password, secret_key, res, cb){
    if(email != undefined && name != undefined && password != undefined && secret_key != undefined){
        var nameCheck = checkName(name, res);
        var passwordCheck = checkPassword(password, res);
        var secret_keyCheck = checkSecret_key(secret_key, res);
        var emailCheck = checkEmail(email, res);
        Promise.all([nameCheck,passwordCheck,secret_keyCheck,emailCheck]).then(function(){
            cb();
        }).catch(function(error){
            res.status(400).json({
                status:{
                    message: error
                }
            }).end();
         });
    }
    else{
        res.status(400).json({
            status:{
                message: 'Waardes ongeldig'
            }
        }).end();
        return false;
    }
}
function checkName(name, res){
    return new Promise(
        function (resolve, reject){
            if(name.lenght < 3){
                reject('Naam ongeldig');
            }
            else{
                resolve();
            }
        }
    );
}
function checkPassword(password, res){
    return new Promise(
        function (resolve, reject){
            if((password.length >= 6 && /\d/.test(password) && /\W/.test(password))){
                resolve();
            }
            else{
                reject('Gebruik een sterk wachtwoord.');
            }
        }
    );
}
function checkSecret_key(secret_key, res){
    return new Promise(
        function (resolve, reject){
            if(secret_key == config.reg_key){
                resolve();
            }
            else{
                reject('Geheime sleutel ongeldig');
            }
        }
    );
}
function checkEmail(email, res){
    return new Promise(
        function (resolve, reject){
            var emailcheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if(emailcheck.test(email)){
                resolve();
            }
            else{
                reject('Emailadres ongeldig');
            }
        }
    );
}


