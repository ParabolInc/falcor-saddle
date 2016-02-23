import * as _ from 'lodash';

const RANGE_ERROR = {
		'$type': 'error',
		value: '[ReferenceError: response is not defined]'
	};

export function generateIndex(min, max) {
	return _.random(min, max);
}

export function generateRange(min, max) {
	let floor = generateIndex(min, max);
	let dif = _.random(0, max - floor);
	return { min: floor, max: floor + dif };
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

export { RANGE_ERROR };
