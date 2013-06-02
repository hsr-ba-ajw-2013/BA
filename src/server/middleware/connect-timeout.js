/** Component: ConnectTimeout
 * HTTP Timeout support from <connect-timeout at
 * https://github.com/LearnBoost/connect-timeout>.
 */

var connectTimeout = require('connect-timeout');

/** Function: connectTimeoutInit
 * Initialiazes <connect-timeout
 * at https://github.com/LearnBoost/connect-timeout>.
 *
 * Parameters:
 *   (Express) app - Initialized express application
 */
module.exports = function connectTimeoutInit(app) {
	app.use(connectTimeout());
};
