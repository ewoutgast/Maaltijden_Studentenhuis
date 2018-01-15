var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var chould = chai.should();
var db = require('../config/connection');
var config = require('../config/general');


chai.use(chaiHttp);


describe('user register',function(){
    describe('register user failed key',function(){
        db.query('DELETE FROM `users` WHERE `email` == test@gmail.com', function(error){
            it('POST /api/v1/register',function(done)
            {
                chai.request(server)
                .put('/api/v1/register')
                .send({ 
                    email: 'test@gmail.com', 
                    name: 'tester',
                    password: '56789kjhgFGH.,',
                    secret_key: 'is dit de sleutel?'
                }).end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    res.body.should.be.json;
                    res.body.should.be.an('object');
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Geheime sleutel ongeldig');
                    done();
                });
            });
        });

    });
    describe('register user failed pass',function(){
        db.query('DELETE FROM `users` WHERE `email` == test@gmail.com', function(error){
            it('POST /api/v1/register',function(done)
            {
                chai.request(server)
                .put('/api/v1/register')
                .send({ 
                    email: 'test@gmail.com', 
                    name: 'tester',
                    password: '123.,',
                    secret_key: config.secret_key
                }).end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);res.body.should.be.json;
                    res.body.should.be.an('object');
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Gebruik een sterk wachtwoord.');
                    done();
                });
            });
        });

    });
    describe('register user wrong email',function(){
        db.query('DELETE FROM `users` WHERE `email` == test@gmail.com', function(error){
            it('POST /api/v1/register',function(done)
            {
                chai.request(server)
                .put('/api/v1/register')
                .send({ 
                    email: 'test', 
                    name: 'tester',
                    password: '56789kjhgFGH.,',
                    secret_key: config.secret_key
                }).end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    res.body.should.be.json;
                    res.body.should.be.an('object');
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Emailadres ongeldig');
                    done();
                });
            });
        });

    });
    describe('register user',function(){
        db.query('DELETE FROM `users` WHERE `email` == test@gmail.com', function(error){
            it('POST /api/v1/register',function(done)
            {
                chai.request(server)
                .put('/api/v1/register')
                .send({ 
                    email: 'test@gmail.com', 
                    name: 'tester',
                    password: '56789kjhgFGH.,',
                    secret_key: config.secret_key
                }).end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    res.body.should.be.json;
                    res.body.should.be.an('object');
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Gebruiker geregistreerd');
                    done();
                });
            });
        });

    });
});