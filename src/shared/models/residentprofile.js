var Barefoot = require('node-barefoot')()
	, Model = Barefoot.Model
	, ResidentProfileModel = Model.extend({
		url: function () {
			return 'api/resident/' +
				this.resident.facebookId +
				'/profile'; }
		, toString: function toString() {
			return 'ResidentProfileModel';
		}
	});

module.exports = ResidentProfileModel;