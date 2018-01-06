import test from 'ava';
import m from '../lib/transform';

test('should transform the data with no headers provided', t => {
	const chunks = ['Mr', 'Foo', 'Bar'];
	const dict = m.transform(chunks);

	t.deepEqual(dict, JSON.stringify({
		0: 'Mr',
		1: 'Foo',
		2: 'Bar'
	}, null, '\t'));

	const altChunks = [`D'hors`, 'test', '2', 3];
	const altChunksResult = {
		0: `D'hors`,
		1: 'test',
		2: '2',
		3: 3
	};

	const dict2 = m.transform(altChunks);
	t.deepEqual(dict2, JSON.stringify(altChunksResult, null, '\t'));
});

test('should transform the data with headers provided', t => {
	const headers = {
		0: 'name',
		1: 'firstName',
		2: 'age'
	};

	const chunks = [
		'Foo',
		'Bar',
		20
	];

	const expectedResult = {
		name: 'Foo',
		firstName: 'Bar',
		age: 20
	};

	const result = m.transform(chunks, headers);
	t.deepEqual(result, JSON.stringify(expectedResult, null, '\t'));
});

test('should transform the data with headers and replace unknown headers with indices', t => {
	const headers = {
		0: 'name',
		1: 'firstName'
	};

	const chunk = [
		'Foo',
		'Bar',
		'too much info?'
	];

	const expectedResult = {
		name: 'Foo',
		firstName: 'Bar',
		2: 'too much info?'
	};

	const result = m.transform(chunk, headers);
	t.deepEqual(result, JSON.stringify(expectedResult, null, '\t'));
});

test('should transform the data even if there are no headers provided', t => {
	const chunk = [
		'Foo',
		'Bar',
		'too much info?'
	];

	const expectedResult = {
		0: 'Foo',
		1: 'Bar',
		2: 'too much info?'
	};

	const result = m.transform(chunk);
	t.deepEqual(result, JSON.stringify(expectedResult, null, '\t'));
});
