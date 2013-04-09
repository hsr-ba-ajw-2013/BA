/** Controller: Home.Controller
 * Home Controller
 */

/** Function: index
 */
exports.index = function index(req, res) {
	res.render('home/views/index', { title: res.__('Welcome at Roomies!') });
};

exports.invite = function(req, res) {
	var shareLink = req.params.sharelink
		, resident = req.user
		, Community = req.app.get('db').daoFactoryManager.getDAO('Community');

	if (resident.isInACommunity()) {
		req.flash('error',
			res.__('What are you trying? You already are in a community.'));
		return res.redirect('/');
	}

	Community.find({ where: {shareLink: shareLink}})
		.success(function findResult(community) {

			if (community !== null) {
				res.cookie('shareLink', shareLink, { maxAge: 300000 });

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