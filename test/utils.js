import test from 'ava';
import m from '../lib/utils';

test('should fail when on single string or bad delimiter', t => {
	t.throws(() => m.delimiter('test'), 'Invalid CSV format');
	t.throws(() => m.delimiter('test#bla#ohshit'), 'Invalid CSV format');
});

test('should detect the delimiter', t => {
	t.deepEqual(m.delimiter('test,bla'), ',');
	t.deepEqual(m.delimiter('test;bla'), ';');
	t.deepEqual(m.delimiter('test,bla;'), ';');
	t.deepEqual(m.delimiter('test,bla,blaa'), ',');
});
