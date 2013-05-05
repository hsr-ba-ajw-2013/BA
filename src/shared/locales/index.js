/** Class: Locales
 * A module containing all available translations for all strings of the
 * application.
 */
var translations = {
		de: require('./de')
		, en: require('./en')
	}
	, _ = require('underscore')
	, languages = _.keys(translations)
	, vsprintf = require('sprintf').vsprintf;

/** Function: translate
 * Translates a text using the available translations to the given
 * language/locale.
 *
 * If no valid translation for the specified locale was found, the original
 * text from the input parameter gets returned.
 *
 * Parameters:
 *     (String) locale - Something like "de" or "en"
 *     (String) text - The string which should be translated
 *
 * Parameters:
 *     (String) the translated text, or if no translation found, the same text
 *              as passed as parameter.
 */
function translate(locale, text) {
	var result = text;

	if(languages.indexOf(locale) !== -1) {
		var translation = translations[locale][text];

		if(!_.isUndefined(translation)) {
			result = translation;
		}
	}

	// If there are more than the usual arguments, try applying them using 
	// sprintf by replacing eventual placeholders:
	if (arguments.length > 2) {
		result = vsprintf(result, Array.prototype.slice.call(arguments, 2));
	}

	return result;
}

module.exports = {
	translate: translate
	, supported: languages
};