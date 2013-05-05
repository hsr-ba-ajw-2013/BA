/** Module: Static
 * Serves static files from the "src/server/public" directory using the common
 * express.js middleware "static". Further the favicon is set here.
 */

var express = require('express'),
	path = require('path');

/** Function: setupStatic
 * Sets up this middleware by simply adding the express.js static middleware to
 * the given app.
 *
 * Parameters:
 *     (Object) app -  Express.JS app
 *     (Object) config -  The loaded configuration
 */
function setupStatic(app, config) {
	app.use(express.static(path.join(config.srcDir, 'server', 'public')));

	app.use(express.favicon(
		path.join(config.srcDir, 'server', 'public', 'images', 'favicon.ico')
		, { maxAge: 2592000000 }) // 30 days
	);
}

module.exports = setupStatic;