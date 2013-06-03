/** Class: RoomiesView
 * Extends the plain <Barefoot.View at
 * http://swissmanu.github.io/barefoot/docs/files/lib/view-js.html>
 * with Roomies specific functionalities.
 */
var Barefoot = require('node-barefoot')()
	, RoomiesView = Barefoot.View.extend()
	, _ = require('underscore')
	, locales = require('../locales')
	, templates = require('../templates')
	, Q = require('q');

/** Function: beforeRender
 * The beforeRender hook is called before the rendering of a view takes place.
 * This implementation ensures that the locale available of this view is
 * inherited down to any available subviews.
 *
 * Parameters:
 *     (Function) resolve - After calling this promise callback, the rendering
 *                          will proceed.
 */
function beforeRender(resolve) {
	if(_.has(this.options, 'locale')) {
		var locale = this.options.locale;
		this.templates.setLocale(this.options.locale);

		Q.when(_.each(this.subviews, function(subview) {
			subview.options.locale = locale;
		}))
		.then(resolve);
	} else {
		resolve();
	}
}

/** Function: afterRender
 * This is an implementaion of afterRender for convenience. Views extending the
 * <RoomiesView> can make super calls on this.
 *
 * Parameters:
 *     (Function) resolve - After calling this promise callback, the rendering
 *                          will proceed.
 */
function afterRender(resolve) {
	resolve();
}

/** Function: setDocumentTitle
 * Takes the given title string, adds " * Roomies" to it and sets it as the
 * documents title.
 *
 * Parameters:
 *     (String) title - The title you'd like to display.
 *
 * See also:
 * * <setPlainDocumentTitle>
 */
function setDocumentTitle(title) {
	this.setPlainDocumentTitle(title + ' &middot; Roomies');
}

/** Function: setPlainDocumentTitle
 * Takes the given title string and sets it as the current documents title.
 *
 * If available, this function triggers a "change:documenttitle" event on the
 * event aggregator.
 *
 * Parameters:
 *     (String) title - The title you'd like to display
 *
 * See also:
 * * <setDocumentTitle>
 */
function setPlainDocumentTitle(title) {
	/* global $ */
	var $title = $('head title');

	if($title.length === 0) {
		$title = this.$('head title');
	}

	$title.html(title);

	if(!_.isUndefined(this.eventAggregator)) {
		this.eventAggregator.trigger('change:documenttitle', title);
	}
}

/** Function: getDataStore
 * Convenient function to return the application wide DataStore.
 *
 * Returns:
 *     (<DataStore at
 *      http://swissmanu.github.io/barefoot/docs/files/lib/datastore-js.html>)
 */
function getDataStore() {
	return this.options.dataStore;
}

/** Function: translate
 * Convenient function to translate a text using the present locale from the
 * options object.
 *
 * Parameters:
 *     (String) text - String to translate
 *
 * Returns:
 *     (String) translated text
 */
function translate() {
	var locale = this.options.locale
		, translateArguments = [locale].concat(_.values(arguments));

	return locales.translate.apply(this, translateArguments);
}


_.extend(RoomiesView.prototype, {
	beforeRender: beforeRender
	, afterRender: afterRender
	, setDocumentTitle: setDocumentTitle
	, setPlainDocumentTitle: setPlainDocumentTitle
	, getDataStore: getDataStore
	, translate: translate
	, templates: templates
});
module.exports = RoomiesView;