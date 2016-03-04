import * as _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { CACHE } from './data/cache.min.js';
import { TEST_SET } from './data/test-set.min.js';
import { TestServer, testModel, batchTestModel } from './utils/test-server.js';

import { createGetByIdRoute,
				 createCallCreateRoute,
 				 createCallDeleteRoute	} from '../src/index';

let tempCache = _.cloneDeep(CACHE);
function resetCache() {
	tempCache = _.cloneDeep(CACHE);
}

chai.use(chaiAsPromised);
const should = chai.should();
const expect = chai.expect;

const testServer = new TestServer();
const model = testModel;
const batchModel = batchTestModel;

const BASE_PATH = 'neighborhoods';
const ACCEPTED_KEYS = ['name', 'population', 'borough'];

const idPromise = async function (id) {
	let o = tempCache.neighborhoodsById[id];
	o.id = id;
	return o;
}

const lengthPromise = async () => _.keys(tempCache.neighborhoodsById).length;

const CREATE_PATH = `${BASE_PATH}.create`;
const createPromise = async function (params) {
	const length = _.keys(tempCache.neighborhoodsById).length;
	tempCache.neighborhoodsById[length] = params;
	tempCache.neighborhoodsById[length].id = length;
	return tempCache.neighborhoodsById[length];
}

const DELETE_PATH = `${BASE_PATH}ById.delete`;
const deletePromise = async (id) => delete tempCache.neighborhoodsById[id];

describe("call core", function() {
	describe('createCallCreateRoute', function() {
		afterEach(async function () {
			resetCache();
		});
    it('exists', async function () {
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
			let create = TEST_SET.creates[0];
			// Create falcor route:
      let routes = [ createCallCreateRoute(BASE_PATH, ACCEPTED_KEYS, createPromise, lengthPromise),
			 							 createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise) ];
			testServer.restart(routes);
			let output = await model.call(CREATE_PATH, [ create.fields ], create.keys);
			// Test!!
			return expect(output).to.deep.equal(create.expected) &&
				expect(await idPromise(create.id)).to.deep.equal(create.record);
		});
		it(`creates records when multiple calls are batched`, async function () {
			let createOne = TEST_SET.creates[0];
			let createTwo = TEST_SET.creates[1];
			// Create falcor route:
			let routes = [ createCallCreateRoute(BASE_PATH, ACCEPTED_KEYS, createPromise, lengthPromise),
			 							 createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise) ];
			testServer.restart(routes);
			let outputOne = await batchModel.call(CREATE_PATH, [ createOne.fields ], createOne.keys);
			let outputTwo = await batchModel.call(CREATE_PATH, [ createTwo.fields ], createTwo.keys);
			// Test!!
			return expect(outputOne).to.deep.equal(createOne.expected) &&
					expect(outputTwo).to.deep.equal(createTwo.expected) &&
					expect(await idPromise(createOne.id)).to.deep.equal(createOne.record) &&
					expect(await idPromise(createTwo.id)).to.deep.equal(createTwo.record);
		});
    // Issue #745 https://github.com/Netflix/falcor/issues/745
    // TODO: Create error handling tests once fixed
  });
  describe('createCallDeleteRoute', function() {
    afterEach(async function () {
			resetCache();
		});
    it('exists', async function () {
      should.exist(createCallDeleteRoute);
    });
		it('creates route as a call function', async function () {
      // Create falcor route:
      let routes = createCallCreateRoute(BASE_PATH, deletePromise, lengthPromise);
      // Test!!
			return expect(routes['route']).to.equal(CREATE_PATH) &&
						 expect(routes['call']).to.be.a('Function');
    });
    it('deletes a record', async function () {
			let del = TEST_SET.deletes[0];
			// Create falcor route:
      let routes = [ createCallDeleteRoute(BASE_PATH, deletePromise, lengthPromise) ];
			testServer.restart(routes);
			let output = await model.call(DELETE_PATH, [ del.id ]);
			// Test!!
			return expect(output).to.deep.equal(del.expected) &&
				expect(await lengthPromise()).to.equal(del.len);
		});
    it(`creates records when multiple calls are batched`, async function () {
			let delOne = TEST_SET.deletes[0];
			let delTwo = TEST_SET.deletes[1];
			// Create falcor route:
			let routes = [ createCallDeleteRoute(BASE_PATH, deletePromise, lengthPromise),
			 							 createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise) ];
			testServer.restart(routes);
			let outputOne = await model.call(DELETE_PATH, [ delOne.id ]);
			let outputTwo = await model.call(DELETE_PATH, [ delTwo.id ]);
			// Test!!
			return expect(outputOne).to.deep.equal(delOne.expected) &&
					expect(outputTwo).to.deep.equal(delTwo.expected) &&
					expect(await lengthPromise()).to.equal(delTwo.len);
		});
    // Issue #745 https://github.com/Netflix/falcor/issues/745
    // TODO: Create error handling tests once fixed
  });
});
