/** Module: CommunityRequired
 * Policy for enforcing the user to be in a community
 */

/** Function: communityRequired
 * Check if the user is in a community
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 *   (Function) next - Callback
 */
module.exports = function communityRequired(req, res, next) {
	var resident = req.user;

	if (!resident) {
		req.flash('error', res.__('An Error occurred.'));
		return res.redirect('..');
	}

	if (!resident.isInACommunity()) {
		req.flash('error', res.__('You\'re not in a community, yet.'));
		return res.redirect('/community/new');
	}

	return next();
};