var util = require('util');

function Exception401(message) {
	this.message = message;
	this.name = "Exception401";
	Error.call(this);
}

util.inherits(Exception401, Error);

module.exports = Exception401;