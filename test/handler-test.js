const sinon = require('sinon');
const chai = require('chai');
const chai_as_promised = require('chai-as-promised');
const sinon_chai = require('sinon-chai');

const should = chai.should();
const expect = chai.expect;

chai.use(chai_as_promised);
chai.use(sinon_chai);

handler = require('../handler');

describe('it works', () => {
  it('should return true', () => {
    let test = true;
    test.should.equal(true);
  })
})