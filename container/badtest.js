const path = require('path')

const t = require('../index');

const input = path.join(__dirname, './test.csv');
const output = path.join(__dirname, './test.json');

const stockInput = path.join(__dirname, './stocks.csv');
const stockOutput = path.join(__dirname, './stocks.json')

const badInput = path.join(__dirname, './bad.csv');
const badOutput = path.join(__dirname, './bad.json');

const millionInput = path.join(__dirname, './million.csv');
const millionOutput = path.join(__dirname, './million.json');

const options = {
	headers: true,
}

// t(input, output).then((destination) => console.log('data generated and path: ', destination));
// t(stockInput, stockOutput).then((destination) => console.log('data generated and path: ', destination));
t(badInput, badOutput, options).then((destination) => console.log('data generated and path: ', destination));
// t(millionInput, millionOutput).then((destination) => console.log('data generated and path: ', destination));
