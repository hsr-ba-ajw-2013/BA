/** Class: Api.Resident.Controller
 * An API controller for interacting with the resident domain objects.
 */
var errors = require('../errors');

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

	residentDao.find({ where: { facebookId: facebookId, enabled: true }})
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


function getAchievements(resident, cb) {
	resident.getAchievements().success(function(achievements) {
		cb(achievements);
	});
}

function getFulfilledTasksPointSum(resident, cb) {
	resident.getFulfilledTasks({attributes: ['SUM(`reward`) AS totalreward']})
	.success(function(sum) {
		cb(sum[0].totalreward);
	});
}

function getProfileWithFacebookId(success, error, facebookId) {
	var db = this.app.get('db')
		, residentDao = db.daoFactoryManager.getDAO('Resident')
		, user = this.req.user;

	residentDao.find({ where: {facebookId: facebookId, enabled: true }})
		.success(function(resident) {
			resident.getCommunity({where: {enabled: true}})
			.success(function(community) {
				getAchievements(resident,
					function(achievements) {
						getFulfilledTasksPointSum(resident,
							function(pointsSum) {
								success({
									resident: resident
									, displayDangerZone:
										resident.id === user.id &&
										resident.isAdmin
									, community: community
									, achievements: achievements
									, achievementsCount: achievements.length
									, pointsSum: pointsSum || 0
								});
						});
					});
			}).error(function(err) {
				error(err);
			});
	}).error(function(err) {
		error(err);
	});
}

module.exports = {
	getResidentWithFacebookId: getResidentWithFacebookId
	, getProfileWithFacebookId: getProfileWithFacebookId
};
