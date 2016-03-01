import * as _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { cache } from './data/cache.js';
import { TestServer, testModel, batchTestModel } from './utils/test-server.js';
import { generateFields,
 				 generateCreateReturn } from './utils/helpers.js';

import { createGetByIdRoute,
				 createCallCreateRoute,
 				 createCallDeleteRoute	} from '../src/index';

let tempCache = _.cloneDeep(cache);
function resetCache() {
	tempCache = _.cloneDeep(cache);
}

chai.use(chaiAsPromised);
const should = chai.should();
const expect = chai.expect;

const testServer = new TestServer();
const model = testModel;
const batchModel = batchTestModel;

const BASE_PATH = 'neighborhoods';

const TYPE_ERROR_ID_UNDEFINED = 'TypeError: Cannot set property \'id\' of undefined';

const RANGE_MIN = 0;
const RANGE_MAX = _.keys(tempCache.neighborhoodsById).length - 1;
const RANGE_OVERFLOW = 10;

const idPromise = async function (id) {
	let o = tempCache.neighborhoodsById[id];
	o.id = id;
	return o;
}

const errorPromise = async function (params) {
	throw new Error('PromiseError');
}

const ACCEPTED_KEYS = ['name', 'population', 'borough'];
const UNACCEPTED_KEYS = _.concat(ACCEPTED_KEYS, ['invalid']);
const lengthPromise = async () => _.keys(tempCache.neighborhoodsById).length;

const CREATE_PATH = `${BASE_PATH}.create`;
const createPromise = async function (params) {
	const length = _.keys(tempCache.neighborhoodsById).length;
	tempCache.neighborhoodsById[length] = params;
	tempCache.neighborhoodsById[length].id = length;
	return tempCache.neighborhoodsById[length];
}
const CREATE_VALUE = ['lorem ipsum', 'lorem ipsum', 'lorem ipsum'];
const CREATE_INVALID_VALUE = _.concat(CREATE_VALUE, ['lorem ipsum']);

const DELETE_PATH = `${BASE_PATH}.delete`;
// const deletePromise = async (obj) => ;

describe("call core", function() {
	describe('createCallCreateRoute', function() {
		afterEach(function () {
			resetCache();
		});

    it('exists', function () {
      should.exist(createCallCreateRoute);
    });

		it('creates route as a call function', async function () {
      // Create falcor route:
      let routes = createCallCreateRoute(BASE_PATH, ACCEPTED_KEYS, createPromise, lengthPromise);

      // Test!!
			return expect(routes['route']).to.equal(CREATE_PATH) &&
						 expect(routes['call']).to.be.a('Function');
    });

		it('creates a new record', async function () {
			let keys = _.concat(['id'], ACCEPTED_KEYS);
			let obj = generateFields(ACCEPTED_KEYS, CREATE_VALUE);
			// Create falcor route:
      let routes = [ createCallCreateRoute(BASE_PATH, ACCEPTED_KEYS, createPromise, lengthPromise),
			 							 createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise) ];
			testServer.restart(routes);

			let output = await model.call(CREATE_PATH, [ obj ], keys);
			let length = await lengthPromise();
			let idObj = _.cloneDeep(obj);
			idObj.id = length - 1;

			// Test!!
			return expect(output).to.deep.equal(generateCreateReturn(obj, length, BASE_PATH)) &&
				expect(await idPromise(length - 1)).to.deep.equal(idObj);
		});

		it(`creates records when multiple calls are batched`, async function () {
			let keysOne = _.concat(['id'], ACCEPTED_KEYS);
			let objOne = generateFields(ACCEPTED_KEYS, CREATE_VALUE);
			let keysTwo = _.concat(['id'], ACCEPTED_KEYS);
			let objTwo = generateFields(ACCEPTED_KEYS, CREATE_VALUE);
			// Create falcor route:
			let routes = [ createCallCreateRoute(BASE_PATH, ACCEPTED_KEYS, createPromise, lengthPromise),
			 							 createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise) ];
			testServer.restart(routes);

			let outputOne = await batchModel.call(CREATE_PATH, [ objOne ], keysOne);
			let outputTwo = await batchModel.call(CREATE_PATH, [ objTwo ], keysTwo);
			let length = await lengthPromise();
			let idObjOne = _.cloneDeep(objOne);
			let idObjTwo = _.cloneDeep(objTwo);
			idObjOne.id = length - 2;
			idObjTwo.id = length - 1;

			// Test!!
			return expect(outputOne).to.deep.equal(
					generateCreateReturn(objOne, await lengthPromise() - 1, BASE_PATH)) &&
					expect(outputTwo).to.deep.equal(
					generateCreateReturn(objTwo, await lengthPromise(), BASE_PATH)) &&
					expect(await idPromise(length - 2)).to.deep.equal(idObjOne) &&
					expect(await idPromise(length - 1)).to.deep.equal(idObjTwo);
		});

		// it('returns a formatted error when unsuccessful', async function () {
		// });
		//
		// it('returns a formatted error and data when multiple ranges are batched', async function () {
		// });
  });
});
