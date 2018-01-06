'use strict';
const fs = require('fs');
const validPath = require('is-valid-path');

const delimiters = [',', ';'];
const csvPattern = /(.*?)\.(csv)/i;
const jsonPattern = /(.*?)\.(json)/i;

exports.validateHeaders = header => header.filter(x => typeof x !== 'string').length === 0;

exports.validateOptions = options => {
	if (options && typeof options !== 'object') {
		throw new Error('Incorrect options object');
	}

	if (options && options.headers) {
		const headers = options.headers;

		if (!Array.isArray(headers) || headers.length === 0) {
			throw new Error('Invalid header arguments');
		}
		if (!this.validateHeaders(headers)) {
			throw new Error('Headers array can only contain strings');
		}
	}
};

exports.validateDelimiter = delimiter => {
	if (delimiters.indexOf(delimiter) === -1) {
		throw new Error('Invalid delimiter');
	}

	return delimiters.indexOf(delimiter) !== -1;
};

exports.validateIO = (path, destination, options) => {
	if (!validPath(path)) {
		throw new Error('Invalid source path');
	}

	if (!path.match(csvPattern)) {
		throw new Error('Invalid CSV file');
	}

	if (!validPath(destination)) {
		throw new Error('Invalid destination path');
	}

	if (!destination.match(jsonPattern)) {
		throw new Error('Invalid JSON destination file name');
	}

	if (options && typeof options !== 'object') {
		throw new Error('Options should be an object');
	}

	fs.accessSync(path, (err, _) => { // eslint-disable-line no-unused-vars
		if (err) {
			throw new Error('Invalid user permissions to open the file');
		}
	});
};
