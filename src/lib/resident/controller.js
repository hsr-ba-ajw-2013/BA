/** Controller: Resident.Controller
 * Resident Controller
 */

/** Function: fresh
 * Shows a form to join a community if the shareLink is valid.
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 */
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
 */
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
};

exports.ownProfile = function(req, res) {
	var resident = req.user;

	return res.redirect('./' + resident.id);
};

function getAchievements(resident, cb) {
	resident.getAchievements().success(function(achievements) {
		cb(achievements, achievements.length);
	});
}

function getFulfilledTasksPointSum(resident, cb) {
	resident.getFulfilledTasks({attributes: ['SUM(`reward`) AS totalreward']}).success(function(sum) {
		cb(sum[0].totalreward);
	});
}

exports.profile = function(req, res) {
	var userId = req.param('id')
		, Resident = req.app.get('db').daoFactoryManager.getDAO('Resident');

	Resident.find(userId).success(function(resident) {
		resident.getCommunity().success(function(community) {
			getAchievements(resident, function(achievements, achievementsCount) {
				getFulfilledTasksPointSum(resident, function(pointsSum) {
					return res.render('resident/views/profile', {
						title: res.__(resident.name + '\'s profile')
						, resident: resident
						, displayDangerZone: resident.id === req.user.id && resident.isAdmin
						, community: community
						, achievements: achievements
						, achievementsCount: achievementsCount
						, pointsSum: pointsSum
					});
				});
			});
		}).error(function(err) {
			console.log(err);
			return res.send(500);
		});
	}).error(function(err) {
		console.log(err);
		return res.send(500);
	});
};

