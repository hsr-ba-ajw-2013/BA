/** Module: ConnectTimeout
 * HTTP Timeout support from <connect-timeout at
 * https://github.com/LearnBoost/connect-timeout>.
 */

var connectTimeout = require('connect-timeout');

/** Function: connectTimeoutInit
 * Initializes <connect-timeout
 * at https://github.com/LearnBoost/connect-timeout>.
 *
 * Parameters:
 *   (Express) app - Initialized express application
 */
module.exports = function connectTimeoutInit(app, config) {
	app.use(connectTimeout( config.connectTimeout ));
};
