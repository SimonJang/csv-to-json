'use strict';
const SINGLE = 'SINGLE';
const DOUBLE = 'DOUBLE';

exports.transform = (chunks, headers) => {
	const dict = Object.create(null);

	if (headers) {
		chunks.forEach((value, index) => {
			const header = headers[index] ? headers[index] : index;
			dict[header] = value;
		});
	} else {
		chunks.forEach((value, index) => {
			dict[index] = value;
		});
	}

	return JSON.stringify(dict, null, '\t');
};

const findQuoteType = (sentence, delimiter) => {
	const doubleCommaPattern = /,"+(.*?)"+,{0,1}/g;
	const doubleSemiPattern = /;"+(.*?)"+;{0,1}/g;

	if (delimiter === ',') {
		const double = doubleCommaPattern.test(sentence);

		return double ? DOUBLE : SINGLE;
	}

	const double = doubleSemiPattern.test(sentence);

	return double ? DOUBLE : SINGLE;
};

const getPattern = quoteType => {
	switch (quoteType) {
		case SINGLE:
			return new RegExp(/'(.*?)'/);
		case DOUBLE:
			return new RegExp(/"(.*?)"/);
		default:
			throw new Error('Unknown quote type');
	}
};

const clean = (chunk, delimiter) => {
	let newChunk = chunk;

	if (chunk[0] === delimiter && chunk.length > 2) {
		newChunk = newChunk.slice(1);
	}

	if (chunk[chunk.length - 1] === delimiter && chunk.length > 2) {
		newChunk = newChunk.slice(0, newChunk.length - 1);
	}

	return newChunk;
};

const lazySplit = (sentence, delimiter) => {
	return sentence.split(delimiter);
};

const intelligentSplit = (sentence, quote, delimiter) => {
	let rootSentence = sentence;
	const pattern = getPattern(quote);
	const results = [];

	let flag = true;
	let skip = false;
	let lastPattern;

	while (flag) {
		const patternResult = lastPattern ? lastPattern : pattern.exec(rootSentence);
		skip = (patternResult && patternResult.index !== 0) && !skip;

		if (!patternResult) {
			const cleaned = clean(rootSentence, delimiter);
			const simpleSplits = lazySplit(cleaned, delimiter);
			for (const split of simpleSplits) {
				results.push(split);
			}
			flag = false;
		}

		if ((patternResult && !lastPattern) && !skip) {
			results.push(patternResult[1]);
			rootSentence = clean(rootSentence.substring(patternResult[1].length + 2), delimiter);

			skip = false;
			lastPattern = undefined;
		} else if (lastPattern && !skip) {
			results.push(patternResult[1]);
			rootSentence = clean(rootSentence.substring(patternResult[1].length + 2), delimiter);

			skip = false;
			lastPattern = undefined;
		}

		if (skip) {
			lastPattern = patternResult;
			const sentenceWithNoQuotes = rootSentence.substring(0, lastPattern.index).trim();
			const cleaned = clean(sentenceWithNoQuotes, delimiter);
			const splitResult = lazySplit(cleaned, delimiter);

			for (const result of splitResult) {
				results.push(result);
			}

			rootSentence = clean(rootSentence.substring(lastPattern.index), delimiter);
		}

		if (pattern.lastIndex === rootSentence.length || rootSentence.trim().length === 0) {
			flag = false;
		}
	}

	return results;
};

const replaceEmptyWithNull = (sentence, delimiter, quoteType) => {
	const newSentence = quoteType === SINGLE ?
		sentence.replace(/\s{0,}'{1}\s+'{1}\s{0,1}/g, 'null') :
		sentence.replace(/\s{0,}"{1}\s+"{1}\s{0,1}/g, 'null');

	return delimiter === ',' ?
		newSentence.replace(/,{1}\s+,/g, ',null,') :
		newSentence.replace(/;{1}\s+;/g, ';null;');
};

exports.splitter = (chunk, delimiter) => {
	const quoteType = findQuoteType(chunk, delimiter);
	const transformedChunk = replaceEmptyWithNull(chunk, delimiter, quoteType);
	const transformations = intelligentSplit(transformedChunk, quoteType, delimiter);

	return transformations;
};
