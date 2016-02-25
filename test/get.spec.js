import * as _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { cache } from './data/cache.js';
import { TestServer, testModel, batchTestModel } from './utils/test-server.js';
import { generateIndex,
				 generateKeys,
				 generateRange,
				 generateIdError,
				 generateRangeError,
 				 arrayToRangeOutput,
			   objectToIdOutput			} from './utils/helpers.js';

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
const badRangePromise = async function (from, to) {
	let response = [];
	for (let id = from; id < to; id++) {
		let v = cache.neighborhoodsById[id];
		v.id = id;
		response.push(v);
	}
	return response;
};
const RANGE_MIN = 0;
const RANGE_MAX = _.keys(cache.neighborhoodsById).length - 1;
const RANGE_OVERFLOW = 10;

const TYPE_ERROR_ID_UNDEFINED = 'TypeError: Cannot set property \'id\' of undefined';

const ID_REPEAT = 10;
const ACCEPTED_KEYS = ['name', 'population', 'borough'];
const ID_PATH = `${BASE_PATH}ById[{keys:ids}]${JSON.stringify(ACCEPTED_KEYS)}`;
const idPromise = async function (id) {
	let o = cache.neighborhoodsById[id];
	o.id = id;
	return o;
}

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
      let routes = createGetRangesRoute(BASE_PATH, rangePromise);

      // Test!
			return expect(routes['route']).to.equal(RANGE_PATH) &&
						 expect(routes['get']).to.be.a('Function');
    });

		_.times(RANGE_REPEAT, function () {
			let range = generateRange(RANGE_MIN, RANGE_MAX);
			it(`returns data for range ${range.min} to ${range.max}`, async function () {
				// Create falcor route:
	      let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise),
											 createGetRangesRoute(BASE_PATH, rangePromise) ];
				testServer.restart(routes);

				// Generate expected output
				let expectedOutput = arrayToRangeOutput(BASE_PATH, `${BASE_PATH}ById`,
					await rangePromise(range.min, range.max), range.min);

				// Test!!
				return model.get(`${BASE_PATH}[${range.min}..${range.max}]`)
					.should.eventually.deep.equal(expectedOutput);
			});
		});

		it('returns data when multiple ranges are batched', async function () {
			let rangeOne = generateRange(RANGE_MIN, RANGE_MAX);
			let rangeTwo = generateRange(RANGE_MIN, RANGE_MAX);
			// Create falcor route:
			let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise),
										 createGetRangesRoute(BASE_PATH, rangePromise) ];
			testServer.restart(routes);

			// Generate expected outputs
			let expectedOutputOne = arrayToRangeOutput(BASE_PATH, `${BASE_PATH}ById`,
				await rangePromise(rangeOne.min, rangeOne.max), rangeOne.min);
			let expectedOutputTwo = arrayToRangeOutput(BASE_PATH, `${BASE_PATH}ById`,
				await rangePromise(rangeTwo.min, rangeTwo.max), rangeTwo.min);

			// Test!!
			return batchModel.get(`${BASE_PATH}[${rangeOne.min}..${rangeOne.max}]`)
					.should.eventually.deep.equal(expectedOutputOne) &&
				batchModel.get(`${BASE_PATH}[${rangeTwo.min}..${rangeTwo.max}]`)
					.should.eventually.deep.equal(expectedOutputTwo);
		});

		it('returns a formatted error when unsuccessful (invalid id)', async function () {
			let range = {
				min: RANGE_MAX - RANGE_OVERFLOW,
				max: RANGE_MAX + RANGE_OVERFLOW
			}
			// Create falcor route:
			let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise),
										 createGetRangesRoute(BASE_PATH, badRangePromise) ];
			testServer.restart(routes);

			// Generate expected output
			let expectedOutput = generateRangeError(range.min, range.max, BASE_PATH,
				TYPE_ERROR_ID_UNDEFINED);

			// Test!!
			return model.get(`${BASE_PATH}[${range.min}..${range.max}]`)
				.should.eventually.be.rejectedWith(expectedOutput);
		});

		it('returns a formatted error and data when multiple ranges are batched', async function () {
			let rangeOne = generateRange(RANGE_MIN, RANGE_MAX);
			let rangeTwo = { min: RANGE_MAX - RANGE_OVERFLOW, max: RANGE_MAX + RANGE_OVERFLOW}
			// Create falcor route:
			let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise),
										 createGetRangesRoute(BASE_PATH, badRangePromise) ];
			testServer.restart(routes);

			// Generate expected outputs
			let expectedOutputOne = arrayToRangeOutput(BASE_PATH, `${BASE_PATH}ById`,
				await rangePromise(rangeOne.min, rangeOne.max), rangeOne.min);
			let expectedOutputTwo = generateRangeError(rangeTwo.min, rangeTwo.max, BASE_PATH,
				TYPE_ERROR_ID_UNDEFINED);

			// Test!!
			return batchModel.get(`${BASE_PATH}[${rangeOne.min}..${rangeOne.max}]`)
					.should.eventually.deep.equal(expectedOutputOne) &&
				batchModel.get(`${BASE_PATH}[${rangeTwo.min}..${rangeTwo.max}]`)
					.should.eventually.be.rejectedWith(expectedOutputTwo);
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

		_.times(ID_REPEAT, function () {
			let id = generateIndex(RANGE_MIN, RANGE_MAX);
			let keys = generateKeys(ACCEPTED_KEYS);
			it(`returns data for ${keys.join(', ')} on id ${id}`, async function () {
				// Create falcor route:
	      let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise) ];
				testServer.restart(routes);

				// Generate expected output
				let expectedOutput = objectToIdOutput(`${BASE_PATH}ById`,
					await idPromise(id), keys);

				// Test!!
				return model.get(`${BASE_PATH}ById[${id}]["${keys.join('", "')}"]`)
					.should.eventually.deep.equal(expectedOutput);
			});
		});

		it('returns data when multiple ids are batched', async function () {
			let idOne = generateIndex(RANGE_MIN, RANGE_MAX);
			let keysOne = generateKeys(ACCEPTED_KEYS);
			let idTwo = generateIndex(RANGE_MIN, RANGE_MAX);
			let keysTwo = generateKeys(ACCEPTED_KEYS);
			// Create falcor route:
			let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise) ];
			testServer.restart(routes);

			// Generate expected outputs
			let expectedOutputOne = objectToIdOutput(`${BASE_PATH}ById`,
				await idPromise(idOne), keysOne);
			let expectedOutputTwo = objectToIdOutput(`${BASE_PATH}ById`,
				await idPromise(idTwo), keysTwo);

			// Test!!
			return batchModel.get(`${BASE_PATH}ById[${idOne}]["${keysOne.join('", "')}"]`)
					.should.eventually.deep.equal(expectedOutputOne) &&
				batchModel.get(`${BASE_PATH}ById[${idTwo}]["${keysTwo.join('", "')}"]`)
					.should.eventually.deep.equal(expectedOutputTwo);
		});

		it('returns a formatted error when unsuccessful (invalid id)', async function () {
			let id = RANGE_MAX + RANGE_OVERFLOW;
			let keys = generateKeys(ACCEPTED_KEYS);
			// Create falcor route:
			let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise) ];
			testServer.restart(routes);

			// Generate expected output
			let expectedOutput = generateIdError(id, keys, `${BASE_PATH}ById`,
				TYPE_ERROR_ID_UNDEFINED);

			// Test!!
			return model.get(`${BASE_PATH}ById[${id}]["${keys.join('", "')}"]`)
				.should.eventually.be.rejectedWith(expectedOutput);
		});

		it('returns a formatted error and data when multiple ranges are batched', async function () {
			let idOne = RANGE_MAX + RANGE_OVERFLOW;
			let keysOne = generateKeys(ACCEPTED_KEYS);
			let idTwo = generateIndex(RANGE_MIN, RANGE_MAX);
			let keysTwo = generateKeys(ACCEPTED_KEYS);
			// Create falcor route:
			let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise) ];
			testServer.restart(routes);

			// Generate expected outputs
			let expectedOutputOne = generateIdError(idOne, keysOne, `${BASE_PATH}ById`,
				TYPE_ERROR_ID_UNDEFINED);
			let expectedOutputTwo = objectToIdOutput(`${BASE_PATH}ById`,
				await idPromise(idTwo), keysTwo);

			// Test!!
			return batchModel.get(`${BASE_PATH}ById[${idOne}]["${keysOne.join('", "')}"]`)
					.should.eventually.be.rejectedWith(expectedOutputOne) &&
				batchModel.get(`${BASE_PATH}ById[${idTwo}]["${keysTwo.join('", "')}"]`)
					.should.eventually.deep.equal(expectedOutputTwo);
		});
  });
});
