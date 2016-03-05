import * as _ from 'lodash';
import chai from 'chai';

const should = chai.should();
const expect = chai.expect;

import { createRoutes	} from '../src/index';

const BASE_PATH = 'neighborhoods';
const ACCEPTED_KEYS = ['name', 'population', 'borough'];
const LENGTH_PATH = `${BASE_PATH}.length`;
const LENGTH_INDEX = 0;
const RANGE_PATH = `${BASE_PATH}[{ranges:indexRanges}]`;
const RANGE_INDEX = 1;
const ID_UPDATE_PATH = `${BASE_PATH}ById[{keys:ids}]${JSON.stringify(ACCEPTED_KEYS)}`;
const ID_UPDATE_INDEX = 2;
const CREATE_PATH = `${BASE_PATH}.create`;
const CREATE_INDEX = 3;
const DELETE_PATH = `${BASE_PATH}ById.delete`;
const DELETE_INDEX = 4;

const lengthPromise = async () => true;
const rangePromise = async (from, to) => true;
const idPromise = async (id) => true;
const updatePromise = async (oldObj, newObj) => true;
const createPromise = async (params) => true;
const deletePromise = async (id) => true;

const INVALID_PARAM = 'invalidRoute';
const invalidPromise = async (id) => true;

const TOO_FEW_ERROR = '{\"update\":[\"Update can\'t be blank\"],\"create\":[\"Create can\'t be blank\"],\"delete\":[\"Delete can\'t be blank\"]}';
const INVALID_ERROR = 'unknown parameters: [\"invalidRoute\"]';

describe('createRoutes', function () {
	it('is available', function () {
    should.exist(createRoutes);
  });
	it('creates routes with all valid parameters', async function () {
		// Create falcor route:
		const routes = createRoutes({
		  routeBasename: BASE_PATH,
		  acceptedKeys: ['name', 'population', 'borough'],
		  getLength: lengthPromise,
		  getRange: rangePromise,
		  getById: idPromise,
		  update: updatePromise,
		  create: createPromise,
		  delete: deletePromise
		});
		// Test!
		return expect(routes[LENGTH_INDEX]['route']).to.equal(LENGTH_PATH) &&
					 expect(routes[LENGTH_INDEX]['get']).to.be.a('Function') &&
					 expect(routes[RANGE_INDEX]['route']).to.equal(RANGE_PATH) &&
		 			 expect(routes[RANGE_INDEX]['get']).to.be.a('Function') &&
					 expect(routes[ID_UPDATE_INDEX]['route']).to.equal(ID_UPDATE_PATH) &&
		 			 expect(routes[ID_UPDATE_INDEX]['get']).to.be.a('Function') &&
		 			 expect(routes[ID_UPDATE_INDEX]['set']).to.be.a('Function') &&
					 expect(routes[CREATE_INDEX]['route']).to.equal(CREATE_PATH) &&
		 			 expect(routes[CREATE_INDEX]['call']).to.be.a('Function') &&
					 expect(routes[DELETE_INDEX]['route']).to.equal(DELETE_PATH) &&
		 			 expect(routes[DELETE_INDEX]['call']).to.be.a('Function');
	});
	it('returns formatted error with only some valid parameters', async function () {
		// Test!
		expect(function () {
			createRoutes({
			  routeBasename: BASE_PATH,
			  acceptedKeys: ['name', 'population', 'borough'],
			  getLength: lengthPromise,
			  getRange: rangePromise,
			  getById: idPromise
		})}).to.throw(TOO_FEW_ERROR);
	});
	it('returns formatted error with invalid parameters', async function () {
		// Test!
		expect(function () {
			createRoutes({
			  routeBasename: BASE_PATH,
			  acceptedKeys: ['name', 'population', 'borough'],
			  getLength: lengthPromise,
			  getRange: rangePromise,
			  getById: idPromise,
			  update: updatePromise,
			  create: createPromise,
			  delete: deletePromise,
				[INVALID_PARAM]: invalidPromise
		})}).to.throw(INVALID_ERROR);
	});
});
