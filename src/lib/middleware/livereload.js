/** Module: Livereload
 * Livereload for development using <express-livereload
 *                             at https://github.com/mnmly/express-livereload>.
 */
var livereload = require('express-livereload');

/** Function: livereloadInit
 * Initializes livereload
 *
 * Parameters:
 *   (Express) app - Initialized express application
 *   (Object) config - Configuration
 */
module.exports = function livereloadInit(app, config) {
	var livereloadConfig = config.livereload || {};
	livereloadConfig.watchDir = config.srcDir;
	livereload(app, config=livereloadConfig);
};