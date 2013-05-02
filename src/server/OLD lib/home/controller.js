/** Controller: Home.Controller
 * Home Controller
 */

/** Function: index
 * Homepage which redirects to /community/new if the currently logged-in user
 * is not in a community yet.
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 */
exports.index = function index(req, res) {
	var resident = req.user;

	if (!resident.isInACommunity()) {
		return res.redirect('/community/new');
	} else {
		return res.render('home/views/index',
			{ title: res.__('Welcome at Roomies!') });
	}
};

/** Function: invite
 * Invite url handler
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 */
exports.invite = function(req, res) {
	var shareLink = req.params.sharelink
		, resident = req.user
		, Community = req.app.get('db').daoFactoryManager.getDAO('Community');

	if (resident.isInACommunity()) {
		req.flash('error',
			res.__('You cannot accept invitations. ' +
				'You already are in a community.'));
		return res.redirect('/');
	}

	Community.find({ where: {shareLink: shareLink}})
		.success(function findResult(community) {

			if (community !== null) {
				req.session.shareLink = shareLink;

				return res.redirect('/community/' +
					community.slug + '/resident/new');
			} else {
				req.flash('error', res.__('This invitation link is invalid.'));
				return res.redirect('/');
			}
		})
		.error(function createError() {
			return res.send(500);
		});
};