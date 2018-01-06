'use strict';
exports.delimiter = row => {
	if (row.split(';').length === 1 && row.split(',').length === 1) {
		throw new Error('Invalid CSV format');
	}

	return row.split(';').length === 1 ? ',' : ';';
};
