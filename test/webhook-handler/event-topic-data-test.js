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
})
