// Test libraries
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinonChai = require('sinon-chai')

const should = chai.should()

chai.use(chaiAsPromised)
chai.use(sinonChai)

// Module under test
const handler = require('../../src/challenge-handler/handler')

// Test data
const challengeEvent = require('./events/challenge.json')

describe('challenge-response tests', () => {
  it('should callback with the challenge if a GET request is made with a challenge', (done) => {
    handler.handleChallengeEvent(challengeEvent, null, (err, res) => {
      should.not.exist(err)
      res.should.be.an('object')
      res.should.deep.equal({
        statusCode: 200,
        body: '{"challenge":"this is a challenge"}'
      })
      done()
    })
  })

  it('should callback with a 400 error if no challenge is sent', (done) => {
    handler.handleChallengeEvent({ requestContext: { httpMethod: 'GET' } }, null, (err, res) => {
      should.not.exist(err)
      res.statusCode.should.equal(400)
      done()
    })
  })
})
