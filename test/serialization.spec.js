import chai from 'chai';

const should = chai.should();
const expect = chai.expect;

const BOOLEAN = true;
const NUMBER = 8;
const STRING = 'Made in Brooklyn';
const NULL = null;
const OBJECT = { id: 26 };

// Module
import serializer from '../src/serialization.js';

// Suite
describe('serializer', function () {
  // Test!
  it('is available', function () {
    should.exist(serializer);
  });
  it('does not change a boolean', function () {
    expect(serializer(BOOLEAN)).to.be.a('boolean');
  });
  it('does not change a number', function () {
    expect(serializer(NUMBER)).to.be.a('number');
  });
  it('does not change a string', function () {
    expect(serializer(STRING)).to.be.a('string');
  });
  it('does not change null', function () {
    expect(serializer(NULL)).to.be.a('null');
  });
  it('does not change an undefined variable', function () {
    expect(serializer(OBJECT['undefined'])).to.be.an('undefined');
  });
  it('changes an object into a string', function () {
    expect(serializer(OBJECT)).to.be.a('string');
  });
});
