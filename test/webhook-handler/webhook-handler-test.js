const AWS_MOCK = require('aws-sdk-mock')
const Topic = require('@lulibrary/lag-utils').Topic

// Test libraries
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const should = chai.should()

const sinon = require('sinon')
const sandbox = sinon.sandbox.create()

const rewire = require('rewire')

// Module under test
const handler = rewire('../../src/webhook-handler/handler')

// Test data
const loanCreatedEvent = require('./events/loan-created-event.json')
const invalidSignatureEvent = require('./events/invalid-signature.json')
const invalidJsonEvent = require('./events/invalid-json.json')
const invalidEventType = require('./events/invalid-event-type.json')

const eventTopicData = require('../../src/webhook-handler/eventTopicData')

describe('webhook handler tests', () => {
  afterEach(() => {
    sandbox.restore()
  })

  describe('validation tests', () => {
    before(() => {
      AWS_MOCK.mock('SSM', 'getParameter', { Parameter: { Value: 'secretkey' } })
      process.env.ALMA_SECRET_KEY_NAME = 'testkey'
    })

    after(() => {
      AWS_MOCK.restore('SSM')
      delete process.env.ALMA_SECRET_KEY_NAME
    })

    it('should callback with a 200 response if a valid event is sent', (done) => {
      const publishStub = sandbox.stub(Topic.prototype, 'publish')
      publishStub.resolves(true)

      handler.handleWebhookEvent(loanCreatedEvent, null, (err, res) => {
        should.not.exist(err)
        res.statusCode.should.equal(200)
        done()
      })
    })

    it('should callback with a 401 response if an invalid event signature is sent', (done) => {
      handler.handleWebhookEvent(invalidSignatureEvent, null, (err, res) => {
        should.not.exist(err)
        res.statusCode.should.equal(401)
        done()
      })
    })

    it('should callback with a 400 response if the event body is not valid JSON', (done) => {
      handler.handleWebhookEvent(invalidJsonEvent, null, (err, res) => {
        should.not.exist(err)
        res.statusCode.should.equal(400)
        done()
      })
    })

    it('should callback with a 422 response if the event type is not supported', (done) => {
      handler.handleWebhookEvent(invalidEventType, null, (err, res) => {
        should.not.exist(err)
        res.statusCode.should.equal(422)
        done()
      })
    })
  })

  describe('Topic publish tests', () => {
    before(() => {
      AWS_MOCK.mock('SSM', 'getParameter', { Parameter: { Value: 'secretkey' } })
      process.env.ALMA_SECRET_KEY_NAME = 'testkey'
      process.env.AWS_DEFAULT_REGION = 'eu-west-2'
    })

    after(() => {
      AWS_MOCK.restore('SSM')
      delete process.env.ALMA_SECRET_KEY_NAME
      delete process.env.AWS_DEFAULT_REGION
    })

    it('should call Topic.publish with the event body', (done) => {
      const publishStub = sandbox.stub(Topic.prototype, 'publish')
      publishStub.resolves(true)

      const expected = loanCreatedEvent.body

      handler.handleWebhookEvent(loanCreatedEvent, null, (err, res) => {
        should.not.exist(err)
        publishStub.should.have.been.calledWith(expected)
        done()
      })
    })

    it('should call eventTopicData.get with the correct loan event', () => {
      const publishStub = sandbox.stub(Topic.prototype, 'publish')
      publishStub.resolves(true)
      const getStub = sandbox.stub(eventTopicData, 'get')
      getStub.returns('')

      const expected = 'LOAN_CREATED'

      handler.__get__('handleSnsPublish')(loanCreatedEvent)
        .then(() => {
          getStub.should.have.been.calledWith(expected)
        })
    })
  })

  describe('End to end tests', () => {
    before(() => {
      AWS_MOCK.mock('SSM', 'getParameter', { Parameter: { Value: 'secretkey' } })
      process.env.ALMA_SECRET_KEY_NAME = 'testkey'
      process.env.AWS_DEFAULT_REGION = 'eu-west-2'
    })

    after(() => {
      AWS_MOCK.restore('SSM')
      delete process.env.ALMA_SECRET_KEY_NAME
      delete process.env.AWS_DEFAULT_REGION
    })

    afterEach(() => {
      AWS_MOCK.restore('SNS')
    })

    it('should return a 500 error if Topic publish is rejected', () => {
      let publishStub = sandbox.stub(Topic.prototype, 'publish')
      publishStub.rejects(new Error('publish failed'))

      handler.handleWebhookEvent(loanCreatedEvent, null, (err, res) => {
        should.not.exist(err)
        res.statusCode.should.equal(500)
      })
    })

    eventTopicData.forEach((data, topicName) => {
      let topicArn = `arn:${topicName.toLowerCase()}`
      it(`should call SNS publish with the event body & correct topic arn ${topicArn}`, (done) => {
        const getStub = sandbox.stub(eventTopicData, 'get')
        getStub.returns({
          sns_arn: topicArn
        })

        const publishStub = sandbox.stub()
        publishStub.callsArgWith(1, null, true)
        AWS_MOCK.mock('SNS', 'publish', publishStub)

        let filename = `./events/${topicName.toLowerCase()}_event.json`
        let event = require(filename)
        let expected = {
          Message: event.body,
          TargetArn: topicArn
        }

        return handler.handleWebhookEvent(event, null, (err, res) => {
          should.not.exist(err)
          res.statusCode.should.equal(200)
          publishStub.should.have.been.calledWith(expected)
          done()
        })
      })
    })
  })
})
