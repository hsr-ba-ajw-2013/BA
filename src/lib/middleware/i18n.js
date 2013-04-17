/** Module: i18n
 * Internationalization support using <i18n at
 *                                    https://github.com/mashpie/i18n-node>.
 */

var i18n = require('i18n'),
	path = require('path');

/** Function: i18nInit
 * Initializes i18n middleware and assigns template helpers.
 *
 * Parameters:
 *   (Express) app - Initialized express application
 *   (Object) config - Configuration
 */
module.exports = function i18nInit(app, config) {
	i18n.configure({
		locales:['en', 'de']
		, directory: path.join(config.srcDir, 'shared', 'locales')
	});
	app.use(i18n.init);

	app.set('__', i18n.__);

	// binding template helpers to request.
	// Credits to https://github.com/enyo #12
	app.use(function i18nTemplateHelpers(req, res, next) {
		res.locals.__ = res.__ = function localsTranslate() {
			return i18n.__.apply(req, arguments);
		};
		res.locals.__n = res.__n = function localsTranslateN() {
			return i18n.__n.apply(req, arguments);
		};
		// do not forget this, otherwise your app will hang
		next();
	});
};