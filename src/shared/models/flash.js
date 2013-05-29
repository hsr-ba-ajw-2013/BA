var Barefoot = require('node-barefoot')()
	, Model = Barefoot.Model
	, FlashModel = Model.extend({
		url: '/api/flash-messages'
		, hasMessages: function hasMessages() {
			return this.has('error') || this.has('warning') ||
				this.has('info') || this.has('success');
		}
	});

module.exports = FlashModel;