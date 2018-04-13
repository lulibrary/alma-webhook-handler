// Test libraries
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
chai.should()

const sinon = require('sinon')
const sandbox = sinon.sandbox.create()

process.env.LoanCreatedTopicArn = 'loan created topic'
process.env.LoanDueDateTopicArn = 'due date topic'
process.env.LoanRenewedTopicArn = 'loan renewed topic'
process.env.LoanReturnedTopicArn = 'loan returned topic'
process.env.RequestCreatedTopicArn = 'request created topic'
process.env.RequestClosedTopicArn = 'request closed topic'
process.env.RequestCanceledTopicArn = 'request canceled topic'
process.env.RequestPlacedOnShelfTopicArn = 'request placed on shelf topic'

// Module under test
const eventTopicData = require('../../src/webhook-handler/eventTopicData')

describe('event topic data tests', () => {
  afterEach(() => {
    sandbox.restore()
  })

  after(() => {
    delete process.env.LoanDueDateTopicArn
  })

  it('should return the loan created ARN environment variable', () => {
    eventTopicData.get('LOAN_CREATED').should.deep.equal({
      sns_arn: 'loan created topic'
    })
  })

  it('should return the loan due date ARN environment variable', () => {
    eventTopicData.get('LOAN_DUE_DATE').should.deep.equal({
      sns_arn: 'due date topic'
    })
  })

  it('should return the loan renewed ARN environment variable', () => {
    eventTopicData.get('LOAN_RENEWED').should.deep.equal({
      sns_arn: 'loan renewed topic'
    })
  })

  it('should return the loan returned ARN environment variable', () => {
    eventTopicData.get('LOAN_RETURNED').should.deep.equal({
      sns_arn: 'loan returned topic'
    })
  })

  it('should return the request created ARN environment variable', () => {
    eventTopicData.get('REQUEST_CREATED').should.deep.equal({
      sns_arn: 'request created topic'
    })
  })

  it('should return the request closed ARN environment variable', () => {
    eventTopicData.get('REQUEST_CLOSED').should.deep.equal({
      sns_arn: 'request closed topic'
    })
  })

  it('should return the request canceled ARN environment variable', () => {
    eventTopicData.get('REQUEST_CANCELED').should.deep.equal({
      sns_arn: 'request canceled topic'
    })
  })

  it('should return the request placed on shelf ARN environment variable', () => {
    eventTopicData.get('REQUEST_PLACED_ON_SHELF').should.deep.equal({
      sns_arn: 'request placed on shelf topic'
    })
  })
})
