var View = require('../roomiesView');

/** Class: Views.Resident.ProfileView
 * Inherits from <RoomiesView> and is responsible for resident profile rendering.
 */
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
		if(!this.residentProfile.model) {
			this.residentProfile.fetch({success: function() {
				resolve();
			}});
		} else {
			resolve();
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
		this.setDocumentTitle(this.translate('Profile'));
		resolve();
	}

	/** Function: toString
	 * Returns the string representation of this class.
	 */
	, toString: function toString() {
		return 'Resident.ProfileView';
	}
});