var User = require('api/models/User'),
	Community = require('api/models/Community');

module.exports = {

	attributes: {
		name: "string",
		description: "string",
		points: "int",
		userId: "int",
		communityId: "int",
	},

	getUser: function() {
		return User.find(this.userId);
	},

	getCommunity: function() {
		return Community.find(this.communityId);
	}

};