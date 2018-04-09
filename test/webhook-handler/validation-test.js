const AWS_MOCK = require('aws-sdk-mock')

// Test libraries
const chai = require('chai')
const chai_as_promised = require('chai-as-promised');
chai.use(chai_as_promised)
const should = chai.should();
const expect = chai.expect;

const sinon = require('sinon');
const sandbox = sinon.sandbox.create();

const HTTPError = require('node-http-error');

// Module under test
const validateRequestSignature = require('../../src/webhook-handler/request-validator');

describe('signature validation tests', () => {  
  afterEach(() => {
    AWS_MOCK.restore('SSM')
  })

  it('should throw an error if the signature is invalid', () => {
    AWS_MOCK.mock('SSM', 'getParameter', { Value: "secretkey" })

    validateRequestSignature("a message", "not a valid signature").should.eventually.be.rejectedWith("An invalid message signature was sent")
      .and.should.eventually.be.an.instanceof(HTTPError)
  })

  it('should not throw an error if the signature is valid', () => {
    AWS_MOCK.mock('SSM', 'getParameter', { Value: "secretkey" })

    validateRequestSignature("{'api':'alma'}", "FPkZ/un59vBhgs4dn6yqhqMosD4oK4/fp8swRtkVxAE=").should.eventually.be.fulfilled;
  })

  it('should be rejected with an error if getParameter fails', () => {
    const getStub = sandbox.stub();
    getStub.callsArgWith(1, new Error('get parameter failed'), null)
    AWS_MOCK.mock('SSM', 'getParameter', getStub)

    validateRequestSignature("a message", "a signature").should.eventually.be.rejectedWith("get parameter failed")
  })

})