'use strict';
const path = require('path');
const Benchmark = require('benchmark');
const convertCSVTOJSON = require('convert-csv-to-json');
const myParser = require('../');

const suite = new Benchmark.Suite();

const sourceWithHeaders = path.join(__dirname, 'test.csv');
const destination = path.join(__dirname, 'test.json');

suite.add('My library', () => {
	myParser(sourceWithHeaders, destination, {headers: true});
}).add('external library 1', () => {
	convertCSVTOJSON.generateJsonFileFromCsv(sourceWithHeaders, destination);
}).on('cycle', event => {
	console.log(event.target);
})
.on('complete', () => {
	console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({async: true});
