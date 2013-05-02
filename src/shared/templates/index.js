/** Class: Templates
 * This class provides access to the precompiled handlebars templates of the
 * roomies application.
 *
 * When starting the application on the server, a "precompiledTemplates.js" file
 * is genereated by precompiling all "*.hbs" files contained in the
 * "src/shared/templates" directory.
 *
 * This particular file will be exposed by the templates module afterwards.
 *
 * In addition, all handlebars helpers are registered here.
 *
 * How to use a template:
 * Assume that you have a template file named "src/shared/templates/fancy.hbs".
 * After precompiliation, you can access that template as the follwoing example
 * shows:
 *
 * > var templates = require('./shared/templates');
 * >     , rendered = templates.fancy();
 *
 * How to set the locale for rendering:
 * Before calling a particular template, you can use the <setLocale> function
 * to define the locale/language, which you'd like to use.
 */
var Handlebars = require('handlebars')
	, _ = require('underscore')
	, precompiledTemplates = require('./precompiledTemplates')
	, locales = require('../locales')
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