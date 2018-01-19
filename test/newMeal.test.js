// Packages
var chai = require('chai');
var chaiHttp = require('chai-http');
var fs = require("fs");

// Files
var server = require('../server.js');
var db = require('../config/connection.js');
var config = require('../config/general.json');

// Set chai functions
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style

chai.use(chaiHttp);

let register_details = {
    email: 'test123test@mail.com', 
    name: 'testaccount',
    password: '56789kjhgFGH.,',
    secret_key: config.reg_key
}

let login_details = {
    email: 'test123test@mail.com',
    password: '56789kjhgFGH.,'
}

var imgFileNameYear = '2030'; // Change this to the year of the datetime-field

var token;

describe('newMeal API interface',function(){
    beforeEach((done) => {
        chai.request(server)
        .post('/api/v1/register')
        .send(register_details)
        .end((err, res) => {
            chai.request(server)
            .post('/api/v1/login')
            .send(login_details)
            .end((err, res) => {
                token = res.body.status.token;
                done();
            });
        });
    });

    afterEach((done) => {
        db.query('DELETE FROM `users` WHERE `email` = ?', register_details.email, function(error){
            if(error) console.log(error);
            db.query('DELETE FROM `meals` WHERE user_id = ?', 3 /* Should be user_id from login response! */, function (error) {
                if(error) console.log(error);
                done();
            });
        });
    });

    after((done) => {
        fs.readdirSync('./uploads/meal_img/')
        .forEach((img) => {
            if(img.startsWith(imgFileNameYear)){
                fs.unlinkSync('./uploads/meal_img/' + img);
            }
        })
        done();
    });

    describe('POST /api/v1/meal/new',function(){    
        it('should make a new meal',function(done)
        {
            chai.request(server)
            .post('/api/v1/meal/new')
            .set('X-Access-Token', token)
            .set('Content-Type', 'multipart/form-data')
            .attach('newMealImg', fs.readFileSync("./test/newMealTestImg/test1.png"), "test1.png")
            .field('datetime', '2030-01-20 18:00') //Please make datetime unique (but ALWAYS use imgFileNameYear as year)
            .field('title', 'pizza')
            .field('desc', 'Even wachten... PIZZA!')
            .field('max_people', 10)
            .end(function (err, res) {  
                res.should.have.status(200); 
                res.body.should.be.an('object');
                res.body.should.have.property('status');
                done();
            });
        });

        it('should give an error when sending no image (but does insert the meal)', function(done){
            chai.request(server)
            .post('/api/v1/meal/new')
            .set('X-Access-Token', token)
            .set('Content-Type', 'multipart/form-data')
            .field('datetime', '2030-01-20 20:00') //Please make datetime unique (but ALWAYS use imgFileNameYear as year)
            .field('title', 'pizza')
            .field('desc', 'Even wachten... PIZZA!')
            .field('max_people', 10)
            .end(function (err, res) {  
                res.should.have.status(400); 
                res.body.should.be.an('object');
                res.body.should.have.property('status');
                res.body.status.should.have.property('query');
                res.body.status.query.should.equal('Bad Request: No image given. Meal created with NULL image.');
                done();
            });
        });

        it('should give an error when creating a new meal in the past', function(done){
            chai.request(server)
            .post('/api/v1/meal/new')
            .set('X-Access-Token', token)
            .set('Content-Type', 'multipart/form-data')
            .attach('newMealImg', fs.readFileSync("./test/newMealTestImg/test1.png"), "test1.png")
            .field('datetime', '2001-01-01 21:00') //Please make datetime unique (but ALWAYS use imgFileNameYear as year)
            .field('title', 'pizza')
            .field('desc', 'Even wachten... PIZZA!')
            .field('max_people', 10)
            .end(function (err, res) {  
                res.should.have.status(400); 
                res.body.should.be.an('object');
                res.body.should.have.property('status');
                res.body.status.should.have.property('query');
                res.body.status.query.should.equal('Bad Request');
                done();
            });
        });
    });
});