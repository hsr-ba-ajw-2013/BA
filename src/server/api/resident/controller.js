/** Class: Api.Resident.Controller
 * An API controller for interacting with the resident domain objects.
 */
var errors = require('../errors')
	, debug = require('debug')('roomies:api:resident:controller');

/** Function: getResidentWithFacebookId
 * Returns a resident with a specific facebook id.
 *
 * Parameters:
 *     (Function) success - Callback function when a resident was found
 *     (Function) error - Callback function if an error occured
 *     (String) facebookId - A potential facbook user id
 */
function getResidentWithFacebookId(success, error, facebookId) {
	debug('get resident with facebook id');

	var db = this.app.get('db')
		, residentDao = db.daoFactoryManager.getDAO('Resident');

	residentDao.find({ where: { facebookId: facebookId, enabled: true }})
		.success(function results(resident) {
			if(resident !== null) {
				success(resident.dataValues);
			} else {
				error(new errors.NotFoundError('FacebookId not found!'));
			}
		})
		.error(function errorOccured(err) {
			error(err);
		});
}

/** Function: getAchievements
 * Fetches achievements for the specified resident
 *
 * Parameters:
 *   (Resident) resident - Resident
 *   (Function) done - Callback
 */
function getAchievements(resident, done, error) {
	debug('get achievements');
	resident.getAchievements().success(function(achievements) {
		done(achievements);
	}).error(error);
}

/** Function: getFulfilledTasksPointSum
 * Fetches sum of fulfilled tasks.
 *
 * Parameters:
 *   (Resident) resident - Resident
 *   (Function) done - Callback
 */
function getFulfilledTasksPointSum(resident, done, error) {
	debug('get fulfilled tasks point sum');
	resident.getFulfilledTasks({attributes: ['SUM(`reward`) AS totalreward']})
	.success(function(sum) {
		done(sum[0].totalreward);
	}).error(error);
}

/** Function: getProfileWithFacebookId
 * Fetches the full profile of a resident using their facebook id as the
 * identifier.
 */
function getProfileWithFacebookId(success, error, facebookId) {
	debug('get profile with facebook id');
	var db = this.app.get('db')
		, residentDao = db.daoFactoryManager.getDAO('Resident')
		, user = this.req.user;

	/** PrivateFunction: forwardError
	 * Convenience function to send an error
	 *
	 * Parameters:
	 *   (Object) err - Error
	 */
	function forwardError(err) {
		debug('forward error');
		return error(err);
	}

	/** PrivateFunction: afterFoundPointsSum
	 * Calls the success callback with the accumulated results of the functions.
	 *
	 * Parameters:
	 *   (Resident) resident - Resident
	 *   (Community) community - Community
	 *   (Achievements) achievements - Achievements
	 *   (Integer) pointsSum - Sum of fulfilled Tasks
	 */
	function afterFoundPointsSum(resident, community, achievements, pointsSum) {
		debug('after found points sum');
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
	}

	/** PrivateFunction: afterFoundAchievements
	 * Gets fulfilled tasks point sum by calling
	 * <getFulfilledTasksPointSum()> & after successfully doing that,
	 * <afterFoundPointsSum()>.
	 *
	 * Parameters:
	 *   (Resident) resident - Resident
	 *   (Community) community - Community
	 *   (Achievements) achievements - Achievements
	 */
	function afterFoundAchievements(resident, community, achievements) {
		debug('after found achievements');
		getFulfilledTasksPointSum(resident, function(pointsSum) {
			afterFoundPointsSum(resident, community, achievements, pointsSum);
		}, forwardError);
	}

	/** PrivateFunction: afterFoundCommunity
	 * Fetches achievements of the resident & calls <afterFoundAchievements()>.
	 *
	 * Parameters:
	 *   (Resident) resident - Resident
	 *   (Community) community - Community
	 */
	function afterFoundCommunity(resident, community) {
		debug('after found community');
		getAchievements(resident, function(achievements) {
			afterFoundAchievements(resident, community, achievements);
		}, forwardError);
	}

	/** PrivateFunction: afterFoundResident
	 * Fetches the community of the resident & calls <afterFoundCommunty()>.
	 *
	 * Parameters:
	 *   (Resident) resident - Resident
	 */
	function afterFoundResident(resident) {
		debug('after found resident');
		resident.getCommunity({where: {enabled: true}})
			.success(function(community) {
				afterFoundCommunity(resident, community);
			})
			.error(forwardError);
	}

	residentDao.find({ where: {facebookId: facebookId, enabled: true }})
		.success(afterFoundResident)
		.error(forwardError);
}

module.exports = {
	getResidentWithFacebookId: getResidentWithFacebookId
	, getProfileWithFacebookId: getProfileWithFacebookId
};
