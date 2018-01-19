// // Packages
// var chai = require('chai');
// var chaiHttp = require('chai-http');
// 
// // Files
// var server = require('../server.js');
// var db = require('../config/connection.js');
// 
// // Set chai functions
// const assert = chai.assert;    // Using Assert style
// const expect = chai.expect;    // Using Expect style
// const should = chai.should();  // Using Should style
// 
// // Start
// chai.use(chaiHttp);
// 
// describe('getMeal API interface', function() {
//     describe('Correctly tests', function() {
//         before(function(){
//             // Create 1 meal
//             var query = 'INSERT INTO meals SET (title, description, datetime, max_amount, user_id) VALUES ("Meal titel", "Meal description", "1111-11-11", "5", "1")';
//             db.query(query, function(error){
//                 if(error){
//                     console.log(error);
//                 }
//             });
//         });
// 
//         it('should GET /api/v1/meals correctly', function(done) {
//             chai.request(server)
//                 .get('/api/v1/meals')
//                 .end(function (err, res) {
//                     expect(err).to.be.null;
//                     expect(res).to.have.status(200);
//                     expect(res).to.be.json;
//                     res.body.should.have.property('result').and.should.be.a('object');
//                     done();
//                 });
//         });
//     });
// 
//     describe('Incorrectly tests', function() {
//         before(function(){
//             // Remove all meals
//             var query = 'DELETE FROM meals';
//             db.query(query, function(error){
//                 if(error){
//                     console.log(error);
//                 }
//             });
//         });
// 
//         it('should GET /api/v1/meals without meals', function(done) {
//             chai.request(server)
//                 .get('/api/v1/meals')
//                 .end(function (err, res) {
//                     expect(err).to.be.null;
//                     expect(res).to.have.status(400);
//                     expect(res).to.be.json;
//                     res.body.status.message.should.equal('No meals found');
//                     done();
//                 });
//         });
//     });
// });