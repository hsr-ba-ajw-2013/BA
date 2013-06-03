/** Class: Models.ResidentProfile
 * ResidentProfile model as a subclass of <Barefoot.Model at
 * http://swissmanu.github.io/barefoot/docs/files/lib/model-js.html>
 */
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