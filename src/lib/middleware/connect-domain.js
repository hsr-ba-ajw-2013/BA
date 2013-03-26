/** Component: ConnectDomain
 * Node.js Domains for asynchronous error handling.
 */


var connectDomain = require('connect-domain');

module.exports = function(app, config) {
	app.use(connectDomain());
};
