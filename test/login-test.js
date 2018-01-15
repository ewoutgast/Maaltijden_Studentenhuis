var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var chould = chai.should();
var db = require('../config/connection');
var config = require('../config/general.json');

var expect = chai.expect;

chai.use(chaiHttp);

describe('user register',function(){
    describe('register user failed key',function(){
        before(function(){
            db.query('DELETE FROM `users` WHERE `email` = "test@gmail.com"', function(error){
                if(error){
                    console.log(error);
                }
            });
        });
    
        it('POST /api/v1/register',function(done)
        {
            chai.request(server)
            .post('/api/v1/register')
            .send({ 
                email: 'test@gmail.com', 
                name: 'tester',
                password: '56789kjhgFGH.,',
                secret_key: 'is dit de sleutel?'
            })
            .end(function (err, res) {  
                res.should.have.status(400); 
                res.body.should.be.an('object');
                res.body.should.have.property('status');
                done();
            });
        });

    });
    describe('register user failed pass',function(){
       before(function(){
            db.query('DELETE FROM `users` WHERE `email` = "test@gmail.com"', function(error){
                if(error){
                    console.log(error);
                }
            });
        });
        it('POST /api/v1/register',function(done)
        {
            chai.request(server)
            .post('/api/v1/register')
            .send({ 
                email: 'test@gmail.com', 
                name: 'tester',
                password: '123.,',
                secret_key: config.reg_key
            })
            .end(function (err, res) {
                res.should.have.status(400); 
                res.body.should.be.an('object');
                res.body.should.have.property('status');
                done();
            });
        });

    });
    describe('register user wrong email',function(){
       before(function(){
            db.query('DELETE FROM `users` WHERE `email` = "test@gmail.com"', function(error){
                if(error){
                    console.log(error);
                }
            });
        });
        it('POST /api/v1/register',function(done)
        {
            chai.request(server)
            .post('/api/v1/register')
            .send({ 
                email: 'test', 
                name: 'tester',
                password: '56789kjhgFGH.,',
                secret_key: config.reg_key
            })
            .end(function (err, res) {
                res.should.have.status(400); 
                res.body.should.be.an('object');
                res.body.should.have.property('status');
                res.body.status.message.should.equal('Emailadres ongeldig');
                done();
            });
        });

    });

    describe('register user',function(){
        before(function(){
            db.query('DELETE FROM `users` WHERE `email` = "test@gmail.com"', function(error){
                if(error){
                    console.log(error);
                }
            });
        });
        it('POST /api/v1/register2',function(done)
        {
            chai.request(server)
            .post('/api/v1/register')
            .send({ 
                email: 'test@gmail.com', 
                name: 'tester',
                password: '56789kjhgFGH.,',
                secret_key: config.reg_key
            })
            .end((err, res)=>{

                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                done();
            });
        });
    });
});
describe('user login',function(){
    describe('login user',function(){
        before(function(){
            chai.request(server)
            .post('/api/v1/register')
            .send({ 
                email: 'test@gmail.com', 
                name: 'tester',
                password: '56789kjhgFGH.,',
                secret_key: config.reg_key
            })
        });
        it('POST /api/v1/login',function(done)
        {
            chai.request(server)
            .post('/api/v1/login')
            .send({ 
                email: 'test@gmail.com', 
                password: '56789kjhgFGH.,'
            })
            .end((err, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.status.should.have.property('token');
                done();
            });
        });
    });
    describe('login user',function(){
        before(function(){
            chai.request(server)
            .post('/api/v1/register')
            .send({ 
                email: 'test@gmail.com', 
                name: 'tester',
                password: '56789kjhgFGH.,',
                secret_key: config.reg_key
            })
        });
        it('POST /api/v1/login',function(done)
        {
            chai.request(server)
            .post('/api/v1/login')
            .send({ 
                email: 'test@gmail.com', 
                password: 'test'
            })
            .end((err, res)=>{
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                done();
            });
        });
    });
    describe('login user',function(){
        before(function(){
            chai.request(server)
            .post('/api/v1/register')
            .send({ 
                email: 'test@gmail.com', 
                name: 'tester',
                password: '56789kjhgFGH.,',
                secret_key: config.reg_key
            })
        });
        it('POST /api/v1/login',function(done)
        {
            chai.request(server)
            .post('/api/v1/login')
            .send({ 
                email: 'test', 
                password: '56789kjhgFGH.,'
            })
            .end((err, res)=>{
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                done();
            });
        });
    });
});