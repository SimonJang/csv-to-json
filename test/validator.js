import path from 'path';
import test from 'ava';
import m from '../lib/validator';

test('should fail on validating the delimiter', t => {
	t.throws(() => m.validateDelimiter('#'), 'Invalid delimiter');
	t.throws(() => m.validateDelimiter('"'), 'Invalid delimiter');
	t.throws(() => m.validateDelimiter(`'`), 'Invalid delimiter');
	t.throws(() => m.validateDelimiter('[]'), 'Invalid delimiter');
	t.throws(() => m.validateDelimiter('.'), 'Invalid delimiter');
});

test('should validate the delimiter', t => {
	t.true(m.validateDelimiter(','));
	t.true(m.validateDelimiter(';'));
});

test('should invalidate headers', t => {
	t.false(m.validateHeaders([1, 2, 3, {foo: 'bar'}]));
});

test('should validate headers', t => {
	t.true(m.validateHeaders(['name', 'firstName', 'id']));
});

test('should fail on options object validation', t => {
	t.throws(() => m.validateOptions('headers'), 'Incorrect options object');
	t.throws(() => m.validateOptions({headers: 'foo'}), 'Invalid header arguments');
	t.throws(() => m.validateOptions({headers: []}), 'Invalid header arguments');
	t.throws(() => m.validateOptions({headers: [1, 2, 3, {foo: 'bar'}]}), 'Headers array can only contain strings');
});

test('should not throw on valid options object', t => {
	t.notThrows(() => m.validateOptions({headers: ['Title', 'Name', 'Price']}));
	t.notThrows(() => m.validateOptions({headers: ['Title']}));
});

test('should fail on IO validation', t => {
	t.throws(() => m.validateIO('bla--?//', './valid-destination.json'), 'Invalid source path');
	t.throws(() => m.validateIO('./valid-source.csv', 'bla--?//'), 'Invalid destination path');
	t.throws(() => m.validateIO('./valid-source.csv', './valid-destination.bson'), 'Invalid JSON destination file name');
	t.throws(() => m.validateIO('./valid-source.casv', './valid-destination.json'), 'Invalid CSV file');
	t.throws(() => m.validateIO('./valid-source.csv', './valid-destination.json', 'foo'), 'Options should be an object');
});

test('should not throw on valid I/O object', t => {
	t.notThrows(() => m.validateIO(path.join(__dirname, 'test.csv'), './valid-destination.json', {}));
});
