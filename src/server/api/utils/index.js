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
	return Math.round(1000*(new Date().getMilliseconds())*(Math.random()+1)) +
		Math.round(1000*(new Date().getMilliseconds())*(Math.random()+1)) +
		Math.round(1000*(new Date().getMilliseconds())*(Math.random()+1));
}

/** Function: buildFormRoute
 * Uses the createExpressJsCallback of an <APIAdater at
 * http://swissmanu.github.io/barefoot/docs/files/lib/apiadapter-js.html> to
 * create a plain express js route for a specific api controller function.
 *
 * Use the success or error argument to inject an URL factory function in case
 * the regarding API function succeeds or fails.
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
 * > api.app.post(modulePrefix, utils.buildFormRoute(
 * >     function success(task, redirect) {
 * >         redirect('/community/' + task.community.slug + '/tasks');
 * >     }
 * >     , function error(err, redirect) {
 * >         redirect('/community/' + this.req.param('slug') + '/tasks/new');
 * >     }
 * >     , api
 * >     , [
 * >         , taskValidators.createTask
 * >         , controller.createTask
 * >     ]
 * > ));
 *
 * Parameters:
 *     (Function) success - A callback with the return value of the API function
 *                          as first argument, and a redirect function as second
 *                          argument.
 *     (Function) error - A callback with the error object of the API function
 *                          as first argument, and a redirect function as second
 *                          argument.
 *     (APIAdapter) api - An APIAdapter instance which you create your API with.
 *     (Function)/(Array) apiFunctiosn - The API function(s) you want to execute
 *
 * Returns:
 *     (Function)
 */
function buildFormRoute(success, error, api, apiFunctions) {
	var redirect = function redirect(targetUrl) {
			this.res.redirect(targetUrl);
		}
		, successWrapper = function successWrapper(apiReturnValue) {
			var routerScope = this;
			success.call(this, apiReturnValue, redirect.bind(routerScope));
		}
		, errorWrapper = function errorWrapper(apiError) {
			var routerScope = this;
			error.call(this, apiError, redirect.bind(routerScope));
		}
		, callback = api.createExpressJsCallback(
			successWrapper
			, errorWrapper
			, apiFunctions
		);

	return callback;
}

module.exports = {
	randomString: randomString
	, randomInt: randomInt
	, buildFormRoute: buildFormRoute
};