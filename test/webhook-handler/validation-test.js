// Test libraries
const chai = require('chai')
const should = chai.should();
const expect = chai.expect;

const HTTPError = require('node-http-error');

// Module under test
const validate = require('../../src/webhook-handler/validate');

describe('signature validation tests', () => {
  it('should throw an error if the signature is invalid', () => {
    expect(() => validate("a message", "not a valid signature")).to.throw(HTTPError, "An invalid message signature was sent")
      .with.property('statusCode', 401)
  })

  it('should not throw an error if the signature is valid', () => {
    expect(() => validate("{'api':'alma'}", "FPkZ/un59vBhgs4dn6yqhqMosD4oK4/fp8swRtkVxAE=")).to.not.throw()
  })
})