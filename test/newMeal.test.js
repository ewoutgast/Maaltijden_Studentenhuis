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

var imgFileName = '2018-01-20T1700_3_pizza.png'; // Change this to the correct imgName if you change the datetime, user or title from the requests (or image-extension)

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
            fs.unlinkSync('./uploads/meal_img/' + imgFileName);
            db.query('DELETE FROM `meals` WHERE user_id = ?', 3 /* Should be user_id from login response! */, function (error) {
                if(error) console.log(error);
                done();
            });
        });
    });

    describe('POST /api/v1/meal/new',function(){    
        it('should make a new meal',function(done)
        {
            chai.request(server)
            .post('/api/v1/meal/new')
            .set('X-Access-Token', token)
            .set('Content-Type', 'multipart/form-data')
            .attach('newMealImg', fs.readFileSync("./test/newMealTestImg/test1.png"), "test1.png")
            .field('user', 3) // Should be user_id from login response!
            .field('datetime', '2018-01-20 18:00:00')
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

        it('should not accept a new meal with a nonexistent user', function(done){
            chai.request(server)
            .post('/api/v1/meal/new')
            .set('X-Access-Token', token)
            .set('Content-Type', 'multipart/form-data')
            .attach('newMealImg', fs.readFileSync("./test/newMealTestImg/test1.png"), "test1.png")
            .field('user', 99999) // Should be user_id from login response!
            .field('datetime', '2018-01-20 18:00:00')
            .field('title', 'pizza')
            .field('desc', 'Even wachten... PIZZA!')
            .field('max_people', 10)
            .end(function (err, res) {  
                res.should.have.status(400); 
                res.body.should.be.an('object');
                res.body.should.have.property('status');
                res.body.status.should.have.property('query');
                res.body.status.query.should.equal('Bad Request: User does not exist');
                done();
            });
        });
    });
});