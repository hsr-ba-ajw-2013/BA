/** Class: Api.Resident.Controller
 * Resident Controller
 */

var errors = require('../errors')
	, utils = require('../utils');

/** Function: getResidentWithFacebookId
 * Returns a resident with a specific facebook id.
 *
 * Parameters:
 *     (Function) success - Callback function when a resident was found
 *     (Function) error - Callback function if an error occured
 *     (String) facebookId - A potential facbook user id
 */
function getResidentWithFacebookId(success, error, facebookId) {
	var db = this.app.get('db')
		, residentDao = db.daoFactoryManager.getDAO('Resident');

	utils.checkPermissionToAccess(this.req);

	residentDao.find({ where: { facebookId: facebookId }})
		.success(function results(resident) {
			if(resident !== null) {
				success(resident);
			} else {
				error(new errors.NotFoundError('FacebookId not found!'));
			}
		})
		.error(function errorOccured(err) {
			error(err);
		});
}

module.exports = {
	getResidentWithFacebookId: getResidentWithFacebookId
};











/** Function: fresh
 * Shows a form to join a community if the shareLink is valid.
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 *
exports.fresh = function(req, res) {
	var shareLink = req.session.shareLink
		, Community = req.app.get('db').daoFactoryManager.getDAO('Community');


	if (!shareLink) {
		return res.send(403);
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

/** Function: create
 * Adds a resident to a community if the sharelink & slug is valid
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 *
exports.create = function(req, res) {
	var shareLink = req.session.shareLink
		, slug = req.params.slug
		, resident = req.user
		, Community = req.app.get('db').daoFactoryManager.getDAO('Community');

	req.session.shareLink = '';

	Community.find({ where: {slug: slug}})
		.success( function findResult(community) {

			if (!community) {
				return res.send(500);
			}

			if (!shareLink) {
				return res.send(403);
			}

			if (shareLink !== community.shareLink) {
				return res.send(403);
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
					return res.send(500);
				});

		})
		.error( function createError() {
			return res.send(500);
		});
};*/