/** Class: Templates
 *
 */
var Handlebars = require('handlebars')
	, _ = require('underscore')
	, precompiledTemplates = require('./precompiledTemplates')
	, locales = require('../shared/locales')
	, locale;


/** PrivateFunction: translationHelper
 * A small helper function to make the <Locales> module available to handlebar
 * templates. It is avialable using the "trans" helper:
 *
 * > <h1>{{trans "Welcome"}}</h1>
 * > // Will probably become "Willkommen" when using german locales.
 *
 * Parameters:
 *     (String) text -  Text to translate using <Locales.translate>.
 *
 * Returns:
 *     (String) a translated version of the text parameter.
 */
function translationHelper(text) {
	return locales.translate(locale, text);
}

/** Function: setLocale
 * Sets the locale which should be used to render the templates.
 *
 * Parameters:
 *     (String) locale - Something like "de", "en" etc.
 *
 * See also:
 * * <Locales>
 */
function setLocale(newLocale) {
	locale = newLocale;
}

Handlebars.registerHelper('trans', translationHelper);


_.extend(precompiledTemplates, { setLocale: setLocale });
module.exports = precompiledTemplates;