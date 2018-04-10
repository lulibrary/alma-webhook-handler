// Test libraries
const sinon = require('sinon');
const chai = require('chai');
const chai_as_promised = require('chai-as-promised');
const sinon_chai = require('sinon-chai');

const should = chai.should();
const expect = chai.expect;

chai.use(chai_as_promised);
chai.use(sinon_chai);

// Module under test
handler = require('../../src/challenge-handler/handler');

// Test data
const challengeEvent = require('./events/challenge.json');

describe('challenge-response tests', () => {
  it('should callback with the challenge if a GET request is made with a challenge', (done) => {
    handler.handleChallengeEvent(challengeEvent, null, (err, res) => {
      expect(err).to.be.null;
      res.should.be.an('object');
      res.should.deep.equal({
        statusCode: 200,
        body: '{"challenge":"this is a challenge"}'
      })
      done()
    })
  })

  it('should callback with a 400 error if no challenge is sent', (done) => {
    handler.handleChallengeEvent({ requestContext: { httpMethod: "GET" } }, null, (err, res) => {
      expect(err).to.be.null;
      res.statusCode.should.equal(400)
      done()
    })
  })
})