var View = require('../roomiesView');

/** Class: Views.Error.NotFoundView
 * Inherits from <RoomiesView> and is responsible for not found display.
 */
module.exports = View.extend({
	el: '#main'

	/** Function: renderView
	 * Renders the not found template
	 */
	, renderView: function renderView() {
		this.$el.html(this.templates.error.notFound());
	}

	/** Function: afterRender
	 * After rendering it sets the document title.
	 *
	 * Parameters:
	 *   (Promise.resolve) resolve - After successfully doing work, resolve
	 *                               the promise.
	 */
	, afterRender: function afterRender(resolve) {
		/* jshint camelcase:false */
		var _super = this.constructor.__super__.afterRender.bind(this);

		this.setDocumentTitle(this.translate('Not Found'));
		_super(resolve);
	}

	/** Function: toString
	 * String representation of this class.
	 */
	, toString: function toString() {
		return 'Error.NotFoundView';
	}
});