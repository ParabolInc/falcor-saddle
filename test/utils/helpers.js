import * as _ from 'lodash';

export function generateIndex(min, max) {
	return _.random(min, max);
}

export function generateRange(min, max) {
	let floor = generateIndex(min, max);
	let dif = _.random(0, max - floor);
	return { min: floor, max: floor + dif };
}

export function generateRangeErrors(min, max, path, error) {
	let response = []
	_.times(max - min, function(i) {
		response.push({
			path: [ path, min + i ],
			value: {
				message: error
			}
		});
	});
	return new Error(response);
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
