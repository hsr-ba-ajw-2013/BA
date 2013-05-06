/** File: Transporter
 * Shared transporter among components which lie underneath the community
 * URL namespace.
 */

/** Function: communityTransporter
 * Finds the community of the logged-in resident and assigns it
 * to the template locals.
 *
 * This is used for every component which lies underneath
 * the community URL namespace.
 *
 * Parameters:
 *   (Request) req - Express.js request instance
 *   (Response) res - Express.js response instance
 *   (Function) next - Next function in chain
 */
module.exports = function communityTransporter(req, res, next) {
	var Community = req.app.get('db').daoFactoryManager.getDAO('Community')
		, resident = req.user;

	res.locals.community = undefined;

	if (!resident || !resident.CommunityId) {
		return next();
	} else {
		Community.find(resident.CommunityId)
			.success( function findResult(community) {
				res.locals.community = community;
				return next();
			})
			.error( function createError() {
				return next();
			});
	}
};