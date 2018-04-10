const AWS_MOCK = require('aws-sdk-mock')
const Topic = require('@lulibrary/lag-utils').Topic;

// Test libraries
const chai = require('chai')
const sinon_chai = require('sinon-chai');
chai.use(sinon_chai)
const should = chai.should();
const expect = chai.expect;

const sinon = require('sinon')
const sandbox = sinon.sandbox.create();

const rewire = require('rewire')

// Module under test
const handler = rewire('../../src/webhook-handler/handler')

// Test data
const loanCreatedEvent = require('./events/loan-created-event.json')
const invalidSignatureEvent = require('./events/invalid-signature.json')
const invalidJsonEvent = require('./events/invalid-json.json')
const invalidEventType = require('./events/invalid-event-type.json')

const eventTopicData = require('../../src/webhook-handler/eventTopicData');

describe('webhook handler tests', () => {
  afterEach(() => {
    sandbox.restore();
  })

  describe('validation tests', () => {
    before(() => {
      AWS_MOCK.mock('SSM', 'getParameter', { Value: "secretkey" })
      process.env.ALMA_SECRET_KEY_NAME = "testkey"
    })

    after(() => {
      AWS_MOCK.restore('SSM')
      delete process.env.ALMA_SECRET_KEY_NAME
    })

    it('should callback with a 200 response if a valid event is sent', (done) => {
      const publishStub = sandbox.stub(Topic.prototype, 'publish')
      publishStub.resolves(true)

      handler.handleWebhookEvent(loanCreatedEvent, null, (err, res) => {
        res.statusCode.should.equal(200)
        done()
      })
    })

    it('should callback with a 401 response if an invalid event signature is sent', (done) => {
      handler.handleWebhookEvent(invalidSignatureEvent, null, (err, res) => {
        res.statusCode.should.equal(401)
        done()
      })
    })

    it('should callback with a 400 response if the event body is not valid JSON', (done) => {
      handler.handleWebhookEvent(invalidJsonEvent, null, (err, res) => {
        res.statusCode.should.equal(400)
        done()
      })
    })

    it('should callback with a 500 response if the event type is not supported', (done) => {
      handler.handleWebhookEvent(invalidEventType, null, (err, res) => {
        res.statusCode.should.equal(500)
        done()
      })
    })
  })

  describe('SNS publish tests', () => {
    before(() => {
      AWS_MOCK.mock('SSM', 'getParameter', { Value: "secretkey" })
      process.env.ALMA_SECRET_KEY_NAME = "testkey"
      process.env.AWS_REGION = "eu-west-2"
    })

    after(() => {
      AWS_MOCK.restore('SSM')
      delete process.env.ALMA_SECRET_KEY_NAME
      delete process.env.AWS_REGION
    })

    it('should call SNS publish with the event body', (done) => {
      const publishStub = sandbox.stub(Topic.prototype, 'publish')
      publishStub.resolves(true)

      const expected = loanCreatedEvent.body;

      handler.handleWebhookEvent(loanCreatedEvent, null, (err, res) => {
        publishStub.should.have.been.calledWith(expected);
        done()
      })
    })

    it('should call eventTopicData.get with the correct loan event', () => {
      const publishStub = sandbox.stub(Topic.prototype, 'publish')
      publishStub.resolves(true)
      const getStub = sandbox.stub(eventTopicData, 'get');
      getStub.returns("");

      const expected = "LOAN_CREATED";

      handler.__get__('handleSnsPublish')(loanCreatedEvent)
        .then(() => {
          getStub.should.have.been.calledWith(expected)
        })
    })
  })
});