import path from 'path';
import fs from 'fs';
import test from 'ava';
import loadJSONFile from 'load-json-file';
import parser from '..';

const destination = path.join(__dirname, 'test.json');
const sourceWithHeaders = path.join(__dirname, 'test.csv');
const sourceWithNoHeaders = path.join(__dirname, 'test-no-headers.csv');

test.afterEach(async () => {
	await fs.unlink(destination);
});

test.serial('should write to a JSON file', async t => {
	await parser(sourceWithHeaders, destination);

	const result = await loadJSONFile(destination);
	t.deepEqual(result, [
		{
			0: 'Name',
			1: 'Age',
			2: 'Place',
			3: 'City'
		},
		{
			0: 'Foo',
			1: '20',
			2: 'Belgium',
			3: `Poel's Kapelle`
		},
		{
			0: 'Bar',
			1: '30',
			2: 'Belgium',
			3: `Poel's Kapelle`
		}
	]);
});

test.serial('should write to a JSON file with headers flag included', async t => {
	await parser(sourceWithHeaders, destination, {headers: true});

	const result = await loadJSONFile(destination);
	t.deepEqual(result, [
		{
			Name: 'Foo',
			Age: '20',
			Place: 'Belgium',
			City: `Poel's Kapelle`
		},
		{
			Name: 'Bar',
			Age: '30',
			Place: 'Belgium',
			City: `Poel's Kapelle`
		}
	]);
});

test.serial('should write to a JSON file with headers provided', async t => {
	await parser(sourceWithNoHeaders, destination, {headers: ['Name', 'Age', 'Place', 'City']});

	const result = await loadJSONFile(destination);
	t.deepEqual(result, [
		{
			Name: 'Foo',
			Age: '20',
			Place: 'Belgium',
			City: `Poel's Kapelle`
		},
		{
			Name: 'Bar',
			Age: '30',
			Place: 'Belgium',
			City: `Poel's Kapelle`
		}
	]);
});
