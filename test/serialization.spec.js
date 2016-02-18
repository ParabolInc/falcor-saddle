import chai from 'chai';
const should = chai.should();

// Module
import serializer from '../src/serialization.js';

// Suite
describe('serializer', function () {
  // test
  it('is available', function () {
    should.exist(serializer);
  });
});
