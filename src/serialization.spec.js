import chai from 'chai';
const should = chai.should();

// Module
import serializer from './serialization';

// Suite
describe('serializer', function () {
  // test
  it('is available', function () {
    should.exist(serializer);
  });
});
