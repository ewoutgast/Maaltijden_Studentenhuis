var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server-1');
var chould = chai.should();

chai.use(chaiHttp);

describe('test de /api/v1/hello endpoints',function(){
    it('',function(){


    });

});



describe('Hello/error', function () {
    it('GET /api/v1/hello/error', function (done) {
        chai.request(server)
            .get('/api/v1/hello/error')
            .end(function (err, res) {
                res.should.have.status(500);
                res.body.should.be.json;
                res.body.should.be.an('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('HIER TREEDT EEN ERROR OP');
                // res.body
                done();
            });
    })
});