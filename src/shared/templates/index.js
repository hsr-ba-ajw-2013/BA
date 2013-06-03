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
	, moment = require('moment')
	, url = require('url')
	, querystring = require('querystring')
	, _ = require('underscore')
	, precompiledTemplates = require('./precompiledTemplates')
	, locales = require('../locales')
	, locale;


/** PrivateFunction: safeStringHelper
 * Marks a text as `safe` which means that there might be HTML in it and
 * this HTML is safe.
 */
function safeStringHelper(text) {
	return new Handlebars.SafeString(text);
}

/** PrivateFunction: translationHelper
 * A small helper function to make the <Locales> module available to handlebar
 * templates. It is avialable using the "trans" helper:
 *
 * > <h1>{{trans "Welcome"}}</h1>
 * > // Will probably become "Willkommen" when using german locales.
 *
 * Parameters:
 *     (String) text -  Text to translate using <Locales.translate>.
 *     (Object) options - If needed, values which should replace placeholders in
 *                        the text.
 *
 * Returns:
 *     (String) a translated version of the text parameter.
 */
function translationHelper(text, options) {
	return locales.translate(locale, text, options);
}


/** PrivateFunction: blockTranslationHelper
 * Will translate a block of text/html and does not escape the content.
 */
function blockTranslationHelper(data, obj) {
	if (!obj) {
		obj = data;
		data = obj.hash;
	}

	return safeStringHelper(translationHelper(obj.fn(this), data));
}

/** PrivateFunction: formatDateHelper
 * Formats a date using moment.
 *
 * Parameters:
 *     (Object) context -
 *     (Object) block -
 *
 * Returns:
 *     (String) version of the date, formatted using moment.
 */
function formatDateHelper(context, block) {
	var f = block.hash.format || "LL";
	if(!context) {
		return 'INVALID DATE';
	}
	return moment(context).format(f);
}

/** Function: urlHelper
 * URL-Formatting
 *
 * Parameters:
 *   (String) path - URL Path
 *   (Object) config - Config containing host, port & protocol
 *   (Boolean) urlEncode - Set to true, it will urlencode
 *
 * Returns:
 *   (String) url
 */
function urlHelper(path, config, urlEncode) {
	var urlData = {
		protocol: config.protocol
		, hostname: config.hostname
		, port: config.port
		, pathname: path
	};
	var formattedUrl = url.format(urlData);
	if(urlEncode === true) {
		return querystring.stringify({u: formattedUrl}).substr(2);
	}
	return formattedUrl;
}

/** Function: debugHelper
 * Debugs the context & an optional value.
 *
 * Parameters:
 *   (Object) optionalValue
 */
function debugHelper(optionalValue) {
	console.log("Current Context");
	console.log("====================");
	console.log(this);

	if (optionalValue) {
		console.log("Value");
		console.log("====================");
		console.log(optionalValue);
	}
}

/** Function: ifEqualHelper
 * Checks if a == b
 */
function ifEqualHelper(a, b, options) {
	if(typeof a === 'function') {
		a = a();
	}
	if(!options) {
		options = b;
		b = null;
	}
	if(a === b) {
		return options.fn(this);
	}
	return options.inverse(this);
}

/** Function: ifNotEqualHelper
 * Checks if a !== b
 */
function ifNotEqualHelper(a, b, options) {
	if(typeof a === 'function') {
		a = a();
	}
	if(!options) {
		options = b;
		b = null;
	}
	if(a !== b) {
		return options.fn(this);
	}
	return options.inverse(this);
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

Handlebars.registerHelper('safestring', safeStringHelper);
Handlebars.registerHelper('trans', translationHelper);
Handlebars.registerHelper('blocktrans', blockTranslationHelper);
Handlebars.registerHelper('formatDate', formatDateHelper);
Handlebars.registerHelper('url', urlHelper);
Handlebars.registerHelper('ifequal', ifEqualHelper);
Handlebars.registerHelper('ifnotequal', ifNotEqualHelper);
Handlebars.registerHelper('debug', debugHelper);

_.extend(precompiledTemplates, { setLocale: setLocale });
module.exports = precompiledTemplates;