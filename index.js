'use strict';
const fs = require('fs');
const eol = require('os').EOL;
const through = require('through2');
const validators = require('./lib/validator');
const utils = require('./lib/utils');
const transform = require('./lib/transform');

module.exports = (path, destination, options) => {
	let hasHeaders = false;
	let useHeaders = false;
	let started = false;
	let delimiter;

	validators.validateIO(path, destination);

	if (options) {
		if (options && typeof options.headers === 'boolean') {
			hasHeaders = true;
		}

		if (options && Array.isArray(options.headers)) {
			validators.validateOptions(options);
			useHeaders = true;
			hasHeaders = false;
		}

		if (options && options.delimiter) {
			validators.validateDelimiter(options.delimiter);
			delimiter = options.delimiter;
		}
	}

	const writeStream = fs.createWriteStream(destination);

	fs.createReadStream(path)
		.pipe(through((chunk, enc, cb) => {
			let dict = started ? '' : '[' + eol;

			const rows = chunk.toString().split(eol).filter(row => row.trim());
			const checkDelimiter = utils.delimiter(rows[0]);

			if (delimiter && checkDelimiter !== delimiter) {
				throw new Error('Incorrect match between found delimiter and provided delimiter');
			}

			if (!delimiter) {
				delimiter = checkDelimiter;
			}

			for (const row of rows) {
				if (hasHeaders) {
					options.headers = row.split(delimiter);
					hasHeaders = false;
					useHeaders = true;
				} else {
					const transformedRow = transform.splitter(Buffer.from(row).filter(item => item !== eol).toString(), delimiter);
					const result = row.trim() ? transform.transform(transformedRow, useHeaders ? options.headers : undefined) : undefined;

					if (started) {
						dict += result ? ',' + result + eol : '';
					} else {
						dict += result ? result + eol : '';
						started = true;
					}
				}
			}

			cb(null, dict ? dict : null);
		}, cb => {
			cb(null, ']');
		}))
		.pipe(writeStream);

	return new Promise(resolve => {
		writeStream.on('close', () => {
			resolve(destination);
		});
	});
};
