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
		facebook: {
			clientID: config.facebook.clientID
			, channelUrl: config.facebook.channelUrl
			, checkStatus: config.facebook.checkStatus
			, useCookies: config.facebook.useCookies
			, parseXfbml: config.facebook.parseXfbml
		}
	};
};