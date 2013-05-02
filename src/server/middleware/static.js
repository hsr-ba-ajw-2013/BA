/** Module: Static
 * Serving static files
 */

var express = require('express'),
	path = require('path');

/** Function: staticInit
 * Initializes the static server.
 */
module.exports = function staticInit(app, config) {
	app.use(express.static(path.join(config.srcDir, 'public')));
};