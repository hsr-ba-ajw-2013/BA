/** Class: Views.Resident.ProfileView
 * Inherits from <RoomiesView> and is responsible for resident profile
 * rendering.
 */
var View = require('../roomiesView');

module.exports = View.extend({
	el: '#main'

	/** Function: initialize
	 * Initializes the View
	 */
	, initialize: function initialize() {
		var residentProfile = this.options.dataStore.get('residentProfile');
		this.residentProfile = residentProfile;
		residentProfile.on('sync', this.renderView.bind(this));
	}

	/** Function: beforeRender
	 * Fetches the profile before rendering, if not yet done.
	 *
	 * Parameters:
	 *   (Promise.resolve) resolve - After successfully doing work, resolve
	 *                               the promise.
	 */
	, beforeRender: function beforeRender(resolve) {
		/* jshint camelcase:false */
		var _super = this.constructor.__super__.beforeRender.bind(this);

		if(!this.residentProfile.model) {
			this.residentProfile.fetch({ success: function() {
				_super(resolve);
			}});
		} else {
			_super(resolve);
		}
	}

	/** Function: renderView
	 * Renders the profile.
	 */
	, renderView: function renderView() {
		var residentProfile = this.options.dataStore.get('residentProfile')
			.toJSON();
		this.$el.html(this.templates.resident.profile(residentProfile));
	}

	/** Function: afterRender
	 * Sets the document title
	 *
	 * Parameters:
	 *   (Promise.resolve) resolve - After successfully doing work, resolve
	 *                               the promise.
	 */
	, afterRender: function afterRender(resolve) {
		/* jshint camelcase:false */
		var _super = this.constructor.__super__.afterRender.bind(this);

		this.setDocumentTitle(this.translate('Profile'));
		_super(resolve);
	}

	/** Function: toString
	 * Returns the string representation of this class.
	 */
	, toString: function toString() {
		return 'Resident.ProfileView';
	}
});