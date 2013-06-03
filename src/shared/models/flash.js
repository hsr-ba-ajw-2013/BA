/** Class: Models.Flash
 * Flash model as a subclass of <Barefoot.Model at
 * http://swissmanu.github.io/barefoot/docs/files/lib/model-js.html>
 */
var Barefoot = require('node-barefoot')()
	, Model = Barefoot.Model
	, FlashModel = Model.extend({
		url: '/api/flash-messages'
		, hasMessages: function hasMessages() {
			return this.has('error') || this.has('warning') ||
				this.has('info') || this.has('success');
		}
		, toString: function() {
			return 'FlashModel';
		}
	});

module.exports = FlashModel;