var View = require('../roomiesView');

/** Class: Views.Community.JoinView
 * Inherits from <RoomiesView> and is responsible for join a community
 * rendering & handling.
 */
module.exports = View.extend({
	el: '#main'

	/** Function: initialize
	 * Initializes the view
	 */
	, initialize: function initialize() {
		var community = this.options.dataStore.get('community');
		this.community = community;
	}

	/** Function: beforeRender
	 * Before rendering it will fetch the community if not done yet.
	 *
	 * Parameters:
	 *   (Promise.resolve) resolve - After successfully doing work, resolve
	 *                               the promise.
	 */
	, beforeRender: function beforeRender(resolve) {
		/* jshint camelcase:false */
		var _super = this.constructor.__super__.beforeRender.bind(this)
			, resolver = function resolver() {
				_super(resolve);
			};

		if(!this.community.has('name')) {
			this.community.fetch({
				success: resolver
				, error: resolver
			});
		} else {
			resolver();
		}
	}

	/** Function: renderView
	 * Renders the join template
	 */
	, renderView: function renderView() {
		var community = this.community
			, user = this.getDataStore().get('currentUser');
		this.$el.html(this.templates.community.join({
			user: user.toJSON()
			, name: community.get('name')
			, slug: community.get('slug')
			, shareLink: community.get('shareLink')
		}));
	}

	/** Function: afterRender
	 * After rendering it will set the document title.
	 *
	 * Parameters:
	 *   (Promise.resolve) resolve - After successfully doing work, resolve
	 *                               the promise.
	 */
	, afterRender: function afterRender(resolve) {
		/* jshint camelcase:false */
		var _super = this.constructor.__super__.afterRender.bind(this);

		this.setDocumentTitle(this.translate('Join Community'));
		_super(resolve);
	}

	/** Function: toString
	 * String representation of this class.
	 */
	, toString: function toString() {
		return 'Community.JoinView';
	}
});