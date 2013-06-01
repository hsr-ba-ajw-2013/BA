var View = require('../roomiesView');

module.exports = View.extend({
	el: '#main'

	, renderView: function() {
		var community = this.getDataStore().get('community').toJSON()
			, config = this.getDataStore().get('AppContextModel').get('config')
			, shareLink = '/join/' + community.shareLink;

		this.$el.html(this.templates.community.invite({
			shareLink: shareLink
			, config: config
		}));
	}
	, afterRender: function(resolve) {
		this.setDocumentTitle(this.translate('Invite'));
		this.twitter();
		resolve();
	}

	, twitter: function() {
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

	, toString: function toString() {
		return 'Community.InviteView';
	}
});