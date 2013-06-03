/** Class: Models.Community
 * Community model as a subclass of <Barefoot.Model at
 * http://swissmanu.github.io/barefoot/docs/files/lib/model-js.html>
 */
var Barefoot = require('node-barefoot')()
	, Model = Barefoot.Model
	, CommunityModel = Model.extend({
		urlRoot: '/api/community'
		, idAttribute: 'id'
		, toString: function toString() {
			return 'CommunityModel';
		}
	});

module.exports = CommunityModel;