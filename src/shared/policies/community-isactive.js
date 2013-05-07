/** Module: CommunityIsActive
 * Policy for enforcing the user to be in a community, which was not deleted
 */

/** Function: communityIsActive
 * Check if the community is enabled
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 *   (Function) next - Callback
 */
module.exports = function communityIsActive(req, res, next) {
	var resident = req.user;

	resident.getCommunity().success(function getSuccess(community) {
		if (!community.enabled) {
			req.flash('error', res.__('Your community was deleted :('));
			return res.redirect('/community/new');
		}

		return next();
	})
	.error(function getError() {
		res.redirect('..');
	});
};