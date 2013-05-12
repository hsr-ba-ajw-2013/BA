/** Class: RoomiesView
 * Extends the plain Barefoot.View with Roomies specific functionalities.
 */
var Barefoot = require('barefoot')()
	, RoomiesView = Barefoot.View.extend()
	, _ = require('underscore')
	, locales = require('../locales');

/** Function: beforeRender
 * The beforeRender hook is called before the rendering of a view takes place.
 * This implementation ensures that the locale available of this view is
 * inherited down to any available subviews.
 */
function beforeRender() {
	if(_.has(this.options, 'locale')) {
		var locale = this.options.locale;

		_.each(this.subviews, function(subview) {
			subview.options.locale = locale;
		});
	}
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
	this.$('head title').html(title);

	if(!_.isUndefined(this.eventAggregator)) {
		this.eventAggregator.trigger('change:documenttitle', title);
	}
}

/** Function: getApplicationModel
 * Convenient function to return the application wide <ApplicationModel> from
 * the DataStore.
 *
 * Returns:
 *     (<ApplicationModel>)
 */
function getApplicationModel() {
	var applicationModel = this.options.dataStore.get('applicationModel');
	return applicationModel;
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
	, setDocumentTitle: setDocumentTitle
	, setPlainDocumentTitle: setPlainDocumentTitle
	, getApplicationModel: getApplicationModel
	, translate: translate
});
module.exports = RoomiesView;