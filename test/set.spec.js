import * as _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { CACHE } from './data/cache.min.js';
import { TEST_SET } from './data/test-set.min.js';
import { TestServer, testModel, batchTestModel } from './utils/test-server.js';

import { createSetByIdRoute } from '../src/index';

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
};

const UPDATE_PATH = `${BASE_PATH}ById[{keys:ids}]${JSON.stringify(ACCEPTED_KEYS)}`;
const updatePromise = async function (oldObj, newObj) {
	_.forEach(_.keys(newObj), function (k) {
		tempCache.neighborhoodsById[oldObj.id][k] = newObj[k];
	});
	return tempCache.neighborhoodsById[oldObj.id];
};

describe("set core", function() {
	describe('createSetByIdRoute', function() {
		afterEach(function () {
			resetCache();
		});
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
		_.forEach(TEST_SET.updates, function (update) {
			it(`updates data for ${update.keys.join(', ')} on id ${update.id}`, async function () {
				// Create falcor route:
	      let routes = [ createSetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise, updatePromise) ];
				testServer.restart(routes);
				let output = await model.set(update.obj);
				return expect(output).to.deep.equal(update.expected) &&
					expect(await idPromise(update.id)).to.deep.equal(update.record);
			});
		});
		it(`updates data when multiple ids are batched`, async function () {
			let updateOne = TEST_SET.updates[0];
			let updateTwo = TEST_SET.updates[1];
			// Create falcor route:
			let routes = [ createSetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise, updatePromise) ];
			testServer.restart(routes);
			let outputOne = await batchModel.set(updateOne.obj);
			let outputTwo = await batchModel.set(updateTwo.obj);
			return expect(outputOne).to.deep.equal(updateOne.expected) &&
				expect(await idPromise(updateOne.id)).to.deep.equal(updateOne.record) &&
				expect(outputTwo).to.deep.equal(updateTwo.expected) &&
				expect(await idPromise(updateTwo.id)).to.deep.equal(updateTwo.record);
		});
		it('returns a formatted error when unsuccessful (invalid id)', async function () {
			let invalid_update = TEST_SET.invalid_updates[0];
			// Create falcor route:
			let routes = [ createSetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise, updatePromise) ];
			testServer.restart(routes);
			// Test!!
			return model.set(invalid_update.obj).should.eventually.be.rejectedWith(invalid_update.expected);
		});
		it('returns a formatted error and data when multiple ranges are batched', async function () {
			let valid_update = TEST_SET.updates[0];
			let invalid_update = TEST_SET.invalid_updates[0];
			// Create falcor route:
			let routes = [ createSetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise, updatePromise) ];
			testServer.restart(routes);
			let output = await batchModel.set(valid_update.obj);
			// Test!!
			return expect(output).to.deep.equal(valid_update.expected) &&
				expect(await idPromise(valid_update.id)).to.deep.equal(valid_update.record) &&
				model.set(invalid_update.obj).should.eventually.be.rejectedWith(invalid_update.expected);
		});
  });
});
