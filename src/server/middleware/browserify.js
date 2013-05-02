/** Component: Browserify
 * <Browserify at http://browserify.org/> enables browser-side javascript
 * to use require().
 */
var browserify = require('browserify-middleware'),
	path = require('path');

/** Function: browserifyInit
 * Applies <browserify-middleware
 *         at https://github.com/ForbesLindesay/browserify-middleware>
 * to the path /js.
 *
 * Parameters:
 *   (Express) app - Initialized express application
 *   (Object) config - Configuration
 */
module.exports = function browserifyInit(app, config) {
	app.use('/js'
		, browserify(path.join(config.srcDir, 'public', 'javascripts'))
	);
};