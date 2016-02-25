import * as _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { cache } from './data/cache.js';
import { TestServer, testModel, batchTestModel } from './utils/test-server.js';
import { generateIndex,
				 generateKeys,
			 	 generateNewObject,
			   generateUpdatedObject,
			   generateIdError				} from './utils/helpers.js';

import { createSetByIdRoute } from '../src/index';

chai.use(chaiAsPromised);
const should = chai.should();
const expect = chai.expect;

const testServer = new TestServer();
const model = testModel;
const batchModel = batchTestModel;

const BASE_PATH = 'neighborhoods';

const TYPE_ERROR_ID_UNDEFINED = 'TypeError: Cannot set property \'id\' of undefined';

const RANGE_MIN = 0;
const RANGE_MAX = _.keys(cache.neighborhoodsById).length - 1;
const RANGE_OVERFLOW = 10;

const ACCEPTED_KEYS = ['name', 'population', 'borough'];
const idPromise = async function (id) {
	let o = cache.neighborhoodsById[id];
	o.id = id;
	return o;
}

const UPDATE_REPEAT = 10;
const UPDATE_PATH = `${BASE_PATH}ById[{keys:ids}]${JSON.stringify(ACCEPTED_KEYS)}`;
const updatePromise = async function (oldObj, newObj) {
	_.forEach(_.keys(newObj), function (k) {
		cache.neighborhoodsById[oldObj.id][k] = newObj[k];
	});
	return cache.neighborhoodsById[oldObj.id];
}
const UPDATE_VALUE = 'lorem ipsum';

describe("set core", function() {
	describe('createSetByIdRoute', function() {
    it('exists', function () {
      should.exist(createSetByIdRoute);
    });

		it('creates route as a set function', async function () {
      // Create falcor route:
      let routes = createSetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise, updatePromise);

      // Test!
			return expect(routes['route']).to.equal(UPDATE_PATH) &&
						 expect(routes['set']).to.be.a('Function');
    });

		_.times(UPDATE_REPEAT, function () {
			let id = generateIndex(RANGE_MIN, RANGE_MAX);
			let keys = generateKeys(ACCEPTED_KEYS);
			let newObj = generateNewObject(id, keys, UPDATE_VALUE, `${BASE_PATH}ById`);
			it(`updates data for ${keys.join(', ')} on id ${id}`, async function () {
				// Create falcor route:
	      let routes = [ createSetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise, updatePromise) ];
				testServer.restart(routes);

				let output = await model.set(newObj);
				return expect(output).to.deep.equal(
					generateUpdatedObject(await idPromise(id), `${BASE_PATH}ById`, keys));
			});
		});

		it(`updates data when multiple ids are batched`, async function () {
			let idOne = generateIndex(RANGE_MIN, RANGE_MAX);
			let keysOne = generateKeys(ACCEPTED_KEYS);
			let newObjOne = generateNewObject(idOne, keysOne, UPDATE_VALUE, `${BASE_PATH}ById`);
			let idTwo = generateIndex(RANGE_MIN, RANGE_MAX);
			let keysTwo = generateKeys(ACCEPTED_KEYS);
			let newObjTwo = generateNewObject(idTwo, keysTwo, UPDATE_VALUE, `${BASE_PATH}ById`);
			// Create falcor route:
			let routes = [ createSetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise, updatePromise) ];
			testServer.restart(routes);

			let outputOne = await batchModel.set(newObjOne);
			let outputTwo = await batchModel.set(newObjTwo);
			return expect(outputOne).to.deep.equal(
					generateUpdatedObject(await idPromise(idOne), `${BASE_PATH}ById`, keysOne)) &&
				expect(outputTwo).to.deep.equal(
					generateUpdatedObject(await idPromise(idTwo), `${BASE_PATH}ById`, keysTwo));
		});

		it('returns a formatted error when unsuccessful (invalid id)', async function () {
			let id = RANGE_MAX + RANGE_OVERFLOW;
			let keys = generateKeys(ACCEPTED_KEYS);
			let newObj = generateNewObject(id, keys, UPDATE_VALUE, `${BASE_PATH}ById`);
			// Create falcor route:
			let routes = [ createSetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise, updatePromise) ];
			testServer.restart(routes);

			// Generate expected output
			let expectedOutput = generateIdError(id, keys, `${BASE_PATH}ById`,
				TYPE_ERROR_ID_UNDEFINED);

			// Test!!
			return model.set(newObj).should.eventually.be.rejectedWith(expectedOutput);
		});

		it('returns a formatted error and data when multiple ranges are batched', async function () {
			let idOne = RANGE_MAX + RANGE_OVERFLOW;
			let keysOne = generateKeys(ACCEPTED_KEYS);
			let newObjOne = generateNewObject(idOne, keysOne, UPDATE_VALUE, `${BASE_PATH}ById`);
			let idTwo = generateIndex(RANGE_MIN, RANGE_MAX);
			let keysTwo = generateKeys(ACCEPTED_KEYS);
			let newObjTwo = generateNewObject(idTwo, keysTwo, UPDATE_VALUE, `${BASE_PATH}ById`);
			// Create falcor route:
			let routes = [ createSetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise, updatePromise) ];
			testServer.restart(routes);

			let outputOne = generateIdError(idOne, keysOne, `${BASE_PATH}ById`,
				TYPE_ERROR_ID_UNDEFINED);
			let outputTwo = await batchModel.set(newObjTwo);

			// Test!!
			return model.set(newObjOne).should.eventually.be.rejectedWith(outputOne) &&
				expect(outputTwo).to.deep.equal(
					generateUpdatedObject(await idPromise(idTwo), `${BASE_PATH}ById`, keysTwo));
		});
  });
});
