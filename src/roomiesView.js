/** Class: RoomiesView
 * Extends the plain Barefoot.View with Roomies specific functionalities.
 */
var Barefoot = require('barefoot')()
	, RoomiesView = Barefoot.View.extend()
	, _ = require('underscore');

/** Function: beforeRender
 * The beforeRender hook is called before the rendering of a view takes place.
 * This implementation ensures that the locale available of this view is
 * inherited down to any available subviews.
 */
RoomiesView.prototype.beforeRender = function beforeRender() {
	if(_.has(this.options, 'locale')) {
		var locale = this.options.locale;

		_.each(this.subviews, function(subview) {
			subview.options.locale = locale;
		});
	}
}

module.exports = RoomiesView;