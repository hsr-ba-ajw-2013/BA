/** Module: Static
 * Serves static files from the "src/server/public" directory using the common
 * express.js middleware "static".
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
}

module.exports = setupStatic;