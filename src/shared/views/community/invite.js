var View = require('../roomiesView');

/** Class: Views.Community.InviteView
 * Inherits from <RoomiesView> and is responsible for invite to community
 * rendering & handling.
 */
module.exports = View.extend({
	el: '#main'

	/** Function: renderView
	 * Renders the invite template.
	 */
	, renderView: function renderView() {
		var community = this.getDataStore().get('community').toJSON()
			, config = this.getDataStore().get('AppContextModel').get('config')
			, shareLink = '/join/' + community.shareLink;

		this.$el.html(this.templates.community.invite({
			shareLink: shareLink
			, config: config
		}));
	}

	/** Function: afterRender
	 * Renders the document title.
	 *
	 * Parameters:
	 *   (Promise.resolve) resolve - After successfully doing work, resolve
	 *                               the promise.
	 */
	, afterRender: function afterRender(resolve) {
		/* jshint camelcase:false */
		var _super = this.constructor.__super__.afterRender.bind(this);

		this.setDocumentTitle(this.translate('Invite'));
		this.twitter();

		_super(resolve);
	}

	/** Function: twitter
	 * Inserts the twitter javascript for rendering & handling the twitter
	 * share button.
	 */
	, twitter: function twitter() {
		/* global $ */
		var self = this;
		// copied & adapted from the twitter dev help
		return !function(s,id){
			var js;
			if($('#' + id).length === 0){
				js = $('<script></script>');
				js.attr('id', id);
				js.attr('src', 'https://platform.twitter.com/widgets.js');
				self.$el.append(js);
			}
		}("script", "twitter-wjs");
	}

	/** Function: toString
	 * Returns the string representation of this class
	 */
	, toString: function toString() {
		return 'Community.InviteView';
	}
});