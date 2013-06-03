var View = require('./roomiesView')
	, templates = require('../templates');

/** Class: Views.HomeView
 * Inherits from <RoomiesView> and is responsible for the home view rendering.
 */
module.exports = View.extend({
	el: '#main'
	, template: templates.login

	/** Function: renderView
	 * Renders the home view.
	 */
	, renderView: function renderView() {
		this.$el.html(this.template({}));
	}

	/** Function: afterRender
	 * Sets the document title.
	 *
	 * Parameters:
	 *   (Promise.resolve) resolve - After successfully doing work, resolve
	 *                               the promise.
	 */
	, afterRender: function afterRender(resolve) {
		/* jshint camelcase:false */
		var _super = this.constructor.__super__.afterRender.bind(this);

		this.setDocumentTitle(this.translate('Welcome'));
		_super(resolve);
	}

	/** Function: toString
	 * Returns a string representation of this class.
	 */
	, toString: function toString() {
		return 'HomeView';
	}
});