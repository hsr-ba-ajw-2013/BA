/** Exception: Exception401
 * 401 Unauthorized exception
 */

var util = require('util');

/** Class: Exception401
 * Inherits from Error.
 */
function Exception401(message) {
	this.message = message;
	this.name = "Exception401";
	Error.call(this, message);
}

util.inherits(Exception401, Error);

module.exports = Exception401;