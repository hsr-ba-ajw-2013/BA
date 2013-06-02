var Barefoot = require('node-barefoot')()
	, Model = Barefoot.Model
	, AppContextModel = Model.extend({
		toString: function toString() {
			return 'AppContextModel';
		}
	});

module.exports = AppContextModel;