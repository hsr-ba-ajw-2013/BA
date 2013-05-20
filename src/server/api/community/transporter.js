/** Class: Api.Community.Transporter
 * Tricky piece of code to ensure that the execution scope of the community
 * related API routes contains an object with the current community database
 * model.
 */

var _ = require('underscore');

/** Function: communityTransporter
 * Finds the community of the logged-in resident and adds it to the API
 * exceution scope/context.
 *
 * Parameters:
 *   (Function) success - Callback on success
 */
function communityTransporter(success) {
	var self = this
		, db = this.req.app.get('db')
		, communityDao = db.daoFactoryManager.getDAO('Community')
		, resident = this.req.user;

	if (_.isUndefined(resident) || _.isUndefined(resident.CommunityId)) {
		return success();

	} else {
		communityDao.find(resident.CommunityId)
			.success(function ok(community) {
				self.community = community;
				return success();
			})
			.error( function nok() {
				return success();
			});
	}
}

module.exports = communityTransporter;