/** Controller: Resident.Controller
 * Resident Controller
 */

/** Function: fresh
 *
 * Parameters:
 *   (express.request) req - Request
 *   (express.response) res - Response
 */
exports.fresh = function(req, res) {
	var shareLink = req.cookies.shareLink
		, Community = req.app.get('db').daoFactoryManager.getDAO('Community');

	//TODO: use cookies for that is not realy the best idee...
	res.clearCookie('shareLink');

	if (shareLink === undefined) {
		return res.send(404);
	}

	Community.find({ where: {shareLink: shareLink}})
		.success( function findResult(community) {

			if (community === null) {
				res.send(500);
			}

			res.render('resident/views/fresh', {
				title: res.__('Join the community %s', community.name)
				, community: {
					name: community.name
					, slug: community.slug
				}
			});
		})
		.error( function createError() {
			res.send(500);
		});

};

exports.create = function(req, res) {
	var slug = req.params.slug
		, resident = req.user
		, Community = req.app.get('db').daoFactoryManager.getDAO('Community');

	Community.find({ where: {slug: slug}})
		.success( function findResult(community) {

			if (community === null) {
				res.send(500);
			}

			resident.setCommunity(community)
				.success(function setResult() {
					req.flash('success',
						res.__('Welcome to the community \'%s\'.'
							, community.name));
					return res.redirect('/');
				})
				.error(function(errors) {
					console.log("errors: ", errors);
					res.send(500);
				});

		})
		.error( function createError() {
			res.send(500);
		});
};

