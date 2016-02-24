import * as _ from 'lodash';

import serialize from '../../src/serialization';

export function generateIndex(min, max) {
	return _.random(min, max);
}

export function generateKeys(acceptedKeys) {
	let n = _.random(0, acceptedKeys.length - 1);
	let k = _.shuffle(acceptedKeys);
	return _.drop(k, n);

}

export function generateRange(min, max) {
	let floor = generateIndex(min, max);
	let dif = _.random(0, max - floor);
	return { min: floor, max: floor + dif };
}

export function generateRangeError(min, max, path, error) {
	let response = [];
	_.times(max - min, function(i) {
		response.push({
			path: [ path, min + i ],
			value: {
				message: error
			}
		});
	});
	return response;
}

export function generateIdError(id, keys, path, error) {
	let response = [];
	_.forEach(keys, function (k) {
		response.push({
			path: [ path, id, k ],
			value: { message: error }
		});
	});
	return response;
}

export function arrayToRangeOutput(path, modelPath, array, min) {
	let response = { json: { } };
	response.json[path] = { };
	_.forEach(array, function (v) {
		response.json[path][v.id] = [ modelPath, v.id ];
	});
	response.json[path]['$__path'] = [ path ];
	return response;
}

export function objectToIdOutput(path, object, keys) {
	let response = { json: { [path]: {
		[object.id]: {
			'$__path': [ path, object.id ]
		},
		['$__path']: [ path ]
	} } };
	_.forEach(keys, function(k) {
		response.json[path][object.id][k] = serialize(object[k]);
	});
	return response;
}
