/** Module: Utils
 * Various utilities
 */

var crypto = require('crypto');

/** Function: randomString
 * Generates a random string using
 * <crypto at http://nodejs.org/api/crypto.html>.
 *
 * Parameters:
 *   (Integer) length - [Optional, default: 12] Length of the generated
 *                                              random string.
 *
 * Returns:
 *   (String) - random string
 */
exports.randomString = function randomString(length) {
	length = length || 12;

	return crypto.pseudoRandomBytes(length).toString('hex').substr(0, length);
};