/** Component: ConnectDomain
 * Node.js Domains for asynchronous error handling using <connect-domain at
 * https://github.com/baryshev/connect-domain>.
 *
 * <domain at http://nodejs.org/api/domain.html> is a node.js API which enables
 * to catch all exceptions even if they appeared within an asynchronous
 * callback.
 */

var connectDomain = require('connect-domain');

/** Function: connectDomainInit
 * Initialiazes <connect-domain at https://github.com/baryshev/connect-domain>.
 *
 * Parameters:
 *   (Express) app - Initialized express application
 */
module.exports = function connectDomainInit(app) {
	app.use(connectDomain());
};
