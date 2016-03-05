import * as _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { CACHE as CACHE } from './data/cache.min.js';
import { TEST_SET } from './data/test-set.min.js';
import { TestServer, testModel, batchTestModel } from './utils/test-server.js';

import { createGetLengthRoute,
				 createGetRangesRoute,
			   createGetByIdRoute 	 } from '../src/index';

chai.use(chaiAsPromised);
const should = chai.should();
const expect = chai.expect;

const testServer = new TestServer();
const model = testModel;
const batchModel = batchTestModel;

const BASE_PATH = 'neighborhoods';
const ACCEPTED_KEYS = ['name', 'population', 'borough'];

const LENGTH_PATH = `${BASE_PATH}.length`;
const lengthPromise = async () => _.keys(CACHE.neighborhoodsById).length;

const RANGE_PATH = `${BASE_PATH}[{ranges:indexRanges}]`;
const rangePromise = async function (from, to) {
	return _.map(_.slice(_.keys(CACHE.neighborhoodsById), from, to + 1), function (id) {
		let v = CACHE.neighborhoodsById[id];
		v.id = `${id}`;
		return v;
	});
};
const badRangePromise = async function (from, to) {
	let response = [];
	for (let id = from; id < to; id++) {
		let v = CACHE.neighborhoodsById[id];
		v.id = `${id}`;
		response.push(v);
	}
	return response;
};

const ID_PATH = `${BASE_PATH}ById[{keys:ids}]${JSON.stringify(ACCEPTED_KEYS)}`;
const idPromise = async function (id) {
	let o = CACHE.neighborhoodsById[id];
	o.id = `${id}`;
	return o;
};

describe("get core", function() {
	describe('createGetLengthRoute', function() {
		beforeEach(async function () {
			model.invalidate(LENGTH_PATH);
		});
    it('exists', async function () {
      should.exist(createGetLengthRoute);
    });
		it('creates route as a get function', async function () {
      // Create falcor route:
      let route = createGetLengthRoute(BASE_PATH, lengthPromise);
      // Test!
			return expect(route['route']).to.equal(LENGTH_PATH) &&
						 expect(route['get']).to.be.a('Function');
    });
    it('returns expected formatted data when successful', async function () {
      // Create falcor route:
      let routes = [ createGetLengthRoute(BASE_PATH, lengthPromise),
			 							 createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise) ];
			testServer.restart(routes);
      // Test!
      return model.getValue(LENGTH_PATH)
				.should.eventually.equal(TEST_SET.len);
    });
  });
	describe('createGetRangesRoute', function() {
    it('exists', async function () {
      should.exist(createGetRangesRoute);
    });
		it('creates route as a get function', async function () {
      // Create falcor route:
      let routes = createGetRangesRoute(BASE_PATH, rangePromise);
      // Test!
			return expect(routes['route']).to.equal(RANGE_PATH) &&
						 expect(routes['get']).to.be.a('Function');
    });
		_.forEach(TEST_SET.ranges, function (range) {
		// _.times(RANGE_REPEAT, function () {
			it(`returns data for range ${range.min} to ${range.max}`, async function () {
				// Create falcor route:
	      let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise),
											 createGetRangesRoute(BASE_PATH, rangePromise) ];
				testServer.restart(routes);
				// Test!!
				return model.get(`${BASE_PATH}[${range.min}..${range.max}]`)
					.should.eventually.deep.equal(range.expected);
			});
		});
		it('returns data when multiple ranges are batched', async function () {
			let rangeOne = TEST_SET.ranges[3];
			let rangeTwo = TEST_SET.ranges[4];
			// Create falcor route:
			let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise),
										 createGetRangesRoute(BASE_PATH, rangePromise) ];
			testServer.restart(routes);
			// Test!!
			return batchModel.get(`${BASE_PATH}[${rangeOne.min}..${rangeOne.max}]`)
					.should.eventually.deep.equal(rangeOne.expected) &&
				batchModel.get(`${BASE_PATH}[${rangeTwo.min}..${rangeTwo.max}]`)
					.should.eventually.deep.equal(rangeTwo.expected);
		});
		it('returns a formatted error when unsuccessful (invalid id)', async function () {
			let invalidRange = TEST_SET.invalid_ranges[0];
			// Create falcor route:
			let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise),
										 createGetRangesRoute(BASE_PATH, badRangePromise) ];
			testServer.restart(routes);
			// Test!!
			return model.get(`${BASE_PATH}[${invalidRange.min}..${invalidRange.max}]`)
				.should.eventually.be.rejectedWith(invalidRange.expected);
		});
		it('returns a formatted error and data when multiple ranges are batched', async function () {
			let validRange = TEST_SET.ranges[4];
			let invalidRange = TEST_SET.invalid_ranges[0];
			// Create falcor route:
			let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise),
										 createGetRangesRoute(BASE_PATH, badRangePromise) ];
			testServer.restart(routes);
			// Test!!
			return batchModel.get(`${BASE_PATH}[${validRange.min}..${validRange.max}]`)
					.should.eventually.deep.equal(validRange.expected) &&
				batchModel.get(`${BASE_PATH}[${invalidRange.min}..${invalidRange.max}]`)
					.should.eventually.be.rejectedWith(invalidRange.expected);
		});
  });
	describe('createGetByIdRoute', function() {
    it('exists', async function () {
      should.exist(createGetByIdRoute);
    });
		it('creates route as a get function', async function () {
      // Create falcor route:
      let routes = createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise);
      // Test!
			return expect(routes['route']).to.equal(ID_PATH) &&
						 expect(routes['get']).to.be.a('Function');
    });
		_.forEach(TEST_SET.ids, function (id) {
			it(`returns data for ${id.keys.join(', ')} on id ${id.id}`, async function () {
				// Create falcor route:
	      let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise) ];
				testServer.restart(routes);
				// Test!!
				return model.get(`${BASE_PATH}ById[${id.id}]["${id.keys.join('", "')}"]`)
					.should.eventually.deep.eql(id.expected);
			});
		});
		it('returns data when multiple ids are batched', async function () {
			let idOne = TEST_SET.ids[2];
			let idTwo = TEST_SET.ids[3];
			// Create falcor route:
			let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise) ];
			testServer.restart(routes);
			// Test!!
			return batchModel.get(`${BASE_PATH}ById[${idOne.id}]["${idOne.keys.join('", "')}"]`)
					.should.eventually.deep.equal(idOne.expected) &&
				batchModel.get(`${BASE_PATH}ById[${idTwo.id}]["${idTwo.keys.join('", "')}"]`)
					.should.eventually.deep.equal(idTwo.expected);
		});
		it('returns a formatted error when unsuccessful (invalid id)', async function () {
			let invalidId = TEST_SET.invalid_ids[0];
			// Create falcor route:
			let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise) ];
			testServer.restart(routes);
			// Test!!
			return model.get(`${BASE_PATH}ById[${invalidId.id}]["${invalidId.keys.join('", "')}"]`)
				.should.eventually.be.rejectedWith(invalidId.expected);
		});
		it('returns a formatted error and data when multiple ranges are batched', async function () {
			let validId = TEST_SET.ids[3];
			let invalidId = TEST_SET.invalid_ids[0];;
			// Create falcor route:
			let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise) ];
			testServer.restart(routes);
			// Test!!
			return batchModel.get(`${BASE_PATH}ById[${validId.id}]["${validId.keys.join('", "')}"]`)
					.should.eventually.deep.equal(validId.expected) &&
				batchModel.get(`${BASE_PATH}ById[${invalidId.id}]["${invalidId.keys.join('", "')}"]`)
					.should.eventually.be.rejectedWith(invalidId.expected)
		});
  });
});
