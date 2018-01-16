// Packages
var chai = require('chai');
var chaiHttp = require('chai-http');

// Files
var server = require('../server');

// Set chai functions
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style

// Start
chai.use(chaiHttp);

describe('Hello API interface', function() {
    it('should GET /api/v1/meals correctly', function(done) {
        chai.request(server)
            .get('/api/v1/meals')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                res.body.should.have.property('result').and.should.be.a('object');
                done();
            });
    });
});