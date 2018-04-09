const AWS_MOCK = require('aws-sdk-mock')

// Test libraries
const chai = require('chai')
const should = chai.should();
const expect = chai.expect;

// Module under test
const handler = require('../../src/webhook-handler/handler')

// Test data
const loanCreatedEvent = require('./events/loan-created-event.json')
const invalidSignatureEvent = require('./events/invalid-signature.json')

describe('webhook handler tests', () => {
  before(() => {
    AWS_MOCK.mock('SSM', 'getParameter', { Value: "secretkey" })
  })

  after(() => {
    AWS_MOCK.restore('SSM')
  })

  it('should callback with a 200 response if a valid event is sent', (done) => {
    handler.handleWebhookEvent(loanCreatedEvent, null, (err, res) => {
      res.statusCode.should.equal(200)
      done()
    })
  })

  it('should callback with a 401 response if an invalid event is sent', (done) => {
    handler.handleWebhookEvent(invalidSignatureEvent, null, (err, res) => {
      res.statusCode.should.equal(401)
      done()
    })
  })
})