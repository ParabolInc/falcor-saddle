import * as _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { cache } from './data/cache.js';
import { TestServer, testModel } from './utils/test-server.js';
import { generateIndex,
				 generateRange,
 				 arrayToRangeOutput } from './utils/helpers.js';

import { createGetLengthRoute,
				 createGetRangesRoute,
			   createGetByIdRoute 	 } from '../src/index';

chai.use(chaiAsPromised);
const should = chai.should();
const expect = chai.expect;

const testServer = new TestServer();
const model = testModel;

const BASE_PATH = 'neighborhoods';

const LENGTH_PATH = `${BASE_PATH}.length`;
const lengthPromise = async () => _.keys(cache.neighborhoodsById).length;

const RANGE_REPEAT = 10;
const RANGE_PATH = `${BASE_PATH}[{ranges:indexRanges}]`;
const rangePromise = async (from, to) =>
	_.map(_.slice(_.keys(cache.neighborhoodsById), from, to + 1), function (id) {
		let v = cache.neighborhoodsById[id];
		v.id = id;
		return v;
	});
const RANGE_MIN = 0;
const RANGE_MAX = _.keys(cache.neighborhoodsById).length;
const RANGE_OVERFLOW = 10;

const ACCEPTED_KEYS = ['name', 'population', 'borough'];
const ID_PATH = `${BASE_PATH}ById[{keys:ids}]${JSON.stringify(ACCEPTED_KEYS)}`;
const idPromise = async (id) => cache.neighborhoodsById[id];

describe("get core", function() {
	describe('createGetLengthRoute', function() {
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
      let routes = [ createGetLengthRoute(BASE_PATH, lengthPromise) ];
			testServer.restart(routes);

      // Test!
      return model.getValue('neighborhoods.length')
				.should.eventually.equal(await lengthPromise());
    });
  });
	describe('createGetRangesRoute', function() {
    it('exists', async function () {
      should.exist(createGetRangesRoute);
    });

		it('creates route as a get function', async function () {
      // Create falcor route:
      let route = createGetRangesRoute(BASE_PATH, rangePromise);

      // Test!
			return expect(route['route']).to.equal(RANGE_PATH) &&
						 expect(route['get']).to.be.a('Function');
    });

		_.times(RANGE_REPEAT, function () {
			let range = generateRange(RANGE_MIN, RANGE_MAX);
			it(`returns data for range ${range.min} to ${range.max}`, async function () {
				// Create falcor route:
	      let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise),
											 createGetRangesRoute(BASE_PATH, rangePromise) ];
				testServer.restart(routes);

				// Test!!
				let expectedOutput = arrayToRangeOutput(BASE_PATH, `${BASE_PATH}ById`,
					await rangePromise(range.min, range.max), range.min);
				return model.get(`${BASE_PATH}[${range.min}..${range.max}]`)
					.should.eventually.deep.equal(expectedOutput);
			});
		});

		it('returns a formatted error when unsuccessful', async function () {
			// Create falcor route:
			let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise),
										 createGetRangesRoute(BASE_PATH, rangePromise) ];
			testServer.restart(routes);


		});
  });
	describe('createGetByIdRoute', function() {
    it('exists', async function () {
      should.exist(createGetByIdRoute);
    });

		it('creates route as a get function', async function () {
      // Create falcor route:
      let route = createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise);

      // Test!
			return expect(route['route']).to.equal(ID_PATH) &&
						 expect(route['get']).to.be.a('Function');
    });
  });
});
