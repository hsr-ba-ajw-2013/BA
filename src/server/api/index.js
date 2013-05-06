/** Module: API
 */
var _ = require('underscore');

/** API Routes Helper
 * A small helper to gather API routes from submodules.
 *
 * It imitates the interface of express.js by providing a function for each HTTP
 * verb. Submodules can call them to register an api route.
 *
 * After all routes are registered, thie API module exports the routes property
 * as barefoot expects.
 */
var api = (function() {
	return {
		routes: {}
		, addRoute: function addRoute(method, route, callback) {
			if(_.isUndefined(this.routes[method])) {
				this.routes[method] = {};
			}
			this.routes[method][route] = callback;
		}

		, get: function get(route, callback) {
			this.addRoute('get', route, callback);
		}
		, post: function post(route, callback) {
			this.addRoute('post', route, callback);
		}
	};
})();


// Get all the API submodules to register their routes:
require('./resident')(api);

module.exports = { routes: api.routes };