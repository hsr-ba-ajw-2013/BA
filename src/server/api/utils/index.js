/** Class: Api.Utils
 * Contains utility functions for the REST API component.
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
function randomString(length) {
	length = length || 12;
	return crypto.pseudoRandomBytes(length).toString('hex').substr(0, length);
}

/** Function: randomInt
 * Generates a *not* cryptographically secure random integer.
 *
 * Most likely to be used only in tests
 *
 * Returns:
 *   (Int) - random integer
 */
function randomInt() {
	return Math.round(1000*(Math.random()+1)) +
		Math.round(1000*(Math.random()+1)) +
		Math.round(1000*(Math.random()+1));
}

/** Function: buildFormRoute
 * Uses the createExpressJsCallback of an <APIAdater at
 * http://swissmanu.github.io/barefoot/docs/files/lib/apiadapter-js.html> to
 * create a plain express js route for a specific api controller function.
 *
 * The success and error callback will redirect to the given successUrl or
 * errorUrl.
 *
 * This factory function is helpful if you want to make an API functionality
 * accessible for form POST requests.
 *
 * Example:
 * Your form should create a new contact. In your client, you'll probalby create
 * a model for the contact and send a POST request via AJAX to your API.
 * As soon as javascript is deactivated, the browser will execute the POST
 * request as soon as you submit the form.
 * Preparing a route with <buildFormRoute>, you can handle this request and
 * redirect the user to an error or success page afterwards.
 *
 * Parameters:
 *     (String) successUrl - The url you want to redirect after a successful
 *                           execution of apiFunction
 *     (String) errorUrl - The url you want to redirect after a failed
 *                         execution of apiFunction
 *     (APIAdapter) api - An APIAdapter instance which you create your API with.
 *     (Function)/(Array) apiFunctiosn - The API function(s) you want to execute
 *
 * Returns:
 *     (Function)
 */
function buildFormRoute(successUrl, errorUrl, api, apiFunctions) {
	var success = function() {
			this.res.redirect(successUrl);
		}
		, error = function() {
			var redirectTarget = errorUrl || successUrl;
			this.res.redirect(redirectTarget);
		}
		, callback = api.createExpressJsCallback(success, error, apiFunctions);

	return callback;
}

module.exports = {
	randomString: randomString
	, randomInt: randomInt
	, buildFormRoute: buildFormRoute
};