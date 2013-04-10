var crypto = require('crypto');

exports.randomString = function randomString(length) {
	length = length || 12;

	return crypto.pseudoRandomBytes(length).toString('hex').substr(0, length);
};