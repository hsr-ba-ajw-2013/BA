/** Module: Locale
 * The Locale middleware makes use of the
 * <locale at https://github.com/jed/locale> Express.JS middleware to identify
 * the best fitting language when processing a request.
 *
 */
var _ = require('underscore')
	, templateLocales = require('../../shared/locales')
	, locale = require('locale')(templateLocales.supported);

/** PrivateFunction: ensureLocale
 * Ensures that a locale-cookie is present at any time when processing a
 * request.
 *
 * Parameters:
 *     (Request) req - Express.JS request object
 *     (Response) res - Express.JS response object
 *     (Function) next - Proceed with the next middleware callback
 */
function ensureLocale(req, res, next) {
	if(_.isUndefined(req.cookies)) {
		req.cookies = { locale: req.locale };
	} else {
		if(_.has(req.cookies, 'locale')) {
			req.cookies = { locale: req.locale };
		} else {
			req.cookies = _.extend(req.cookies, { locale: req.locale });
		}
	}

	next();
}

/** PrivateFunction: putLocaleToRequest
 * Saves the locale value from the cookie into the request-object for later
 * access.
 *
 * Parameters:
 *     (Request) req - Express.JS request object
 *     (Response) res - Express.JS response object
 *     (Function) next - Proceed with the next middleware callback
 */
function putLocaleToRequest(req, res, next) {
	res.cookie('locale', req.locale);
	next();
}

/** Function: setupLocale
 * Boots the locale middleware and adds the needed stuff to the given Express.JS
 * applications.
 *
 * Parameters:
 *     (Object) app - Express.JS app
 */
function setupLocale(app) {
	app.use(locale);

	app.use(ensureLocale);
	app.use(putLocaleToRequest);
}

module.exports = setupLocale;