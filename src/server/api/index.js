var _ = require('underscore');

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


require('./resident')(api);


module.exports = { routes: api.routes };