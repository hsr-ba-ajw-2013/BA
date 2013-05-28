/** Component: ClientConfig
 * Passes configured variables to the template.
 */

/** Function: clientConfigInit
 * Sets <app.locals.config at http://expressjs.com/api.html#app.locals>.
 *
 * Parameters:
 *   (Express) app - Initialized express application
 *   (Object) config - Configuration
 */
module.exports = function clientConfigInit(app, config) {
	app.locals.config = {
		port: config.http.port
		, hostname: config.http.hostname
		, protocol: config.http.protocol
	};
};