import * as _ from 'lodash';
import { cache } from './data/cache.js';
import { TestServer, testModel } from './utils/test-server.js';

import { createGetLengthRoute,
				 createGetRangesRoute,
			   createGetByIdRoute 	 } from '../src/index';

const BASE_PATH = 'neighborhoods';

const testServer = new TestServer();
const model = testModel;

const RANGE_REPEAT = 10;
const RANGE_PATH = `${BASE_PATH}[{ranges:indexRanges}]`;
const rangePromise = async (from, to) =>
	_.map(_.slice(_.keys(cache.neighborhoodsById), from, to + 1), function (id) {
		let v = cache.neighborhoodsById[id];
		v.id = id;
		return v;
	});
const badRangePromise = async (from, to) => {
	response = [];
	for (var i=from; i < to; i++) {
		let v = cache.neighborhoodsById[id];
		v.id = id;
		response.push(v);
	}
	return response;
}

const RANGE_MIN = 0;
const RANGE_MAX = _.keys(cache.neighborhoodsById).length - 1;
const RANGE_OVERFLOW = 10;

const ACCEPTED_KEYS = ['name', 'population', 'borough'];
const ID_PATH = `${BASE_PATH}ById[{keys:ids}]${JSON.stringify(ACCEPTED_KEYS)}`;
const idPromise = async (id) => cache.neighborhoodsById[id];

console.log('this is running');

let routes = [ createGetByIdRoute(BASE_PATH, ACCEPTED_KEYS, idPromise),
							 createGetRangesRoute(BASE_PATH, badRangePromise) ];
testServer.restart(routes);

model.get(`${BASE_PATH}[${RANGE_MAX - RANGE_OVERFLOW}..${400}]`).progressively().then(function(jsonGraphEnvelope) {
	console.log(JSON.stringify(jsonGraphEnvelope, null, 4));
});
