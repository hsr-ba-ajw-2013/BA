/** Class: Api.Rank.Controller
 * Ranking-related CRUD
 */

var errors = require('./errors');

/** PrivateFunction: getTaskDao
 * Shortcut function to get the data access object for task entities.
 *
 * Returns:
 *     (Object) sequelize data access object for task entities.
 */
function getTaskDao() {
	var db = this.app.get('db')
		, taskDao = db.daoFactoryManager.getDAO('Task');

	return taskDao;
}

/** PrivateFunction: getResidentDao
 * Shortcut function to get the data access object for resident entities.
 *
 * Returns:
 *     (Object) sequelize data access object for resident entities.
 */
function getResidentDao() {
	var db = this.app.get('db')
		, residentDao = db.daoFactoryManager.getDAO('Resident');

	return residentDao;
}

/** Function: getRankingListForCommunity
 * Show the ranking list of the community
 *
 * Parameters:
 *   (Function) success - Callback on success
 *   (Function) error - Callback in case of an error
 *   (String) communitySlug - The slug of the community to show the rankint list
 *                            for.
 */
function getRankingListForCommunity(success, error) {
	var self = this
		, community = self.req.community;

	community.getResidents({where: {enabled: true }})
	.success(function residentsResult(residents) {
		if (!residents) {
			var noResidentInCommunityError =
				new errors.NoResidentInCommunityError(
					'No Residents where found in the community');
			return error(noResidentInCommunityError);
		}

		var taskDao = getTaskDao.call(self)
			, residentDao = getResidentDao.call(self);/*
			, today = new Date()
			, lastWeek = new Date(today.getTime()-1000*60*60*24*7);
			*/
		residentDao.findAll({
			attributes: [['COALESCE(SUM("fulfilledTasks"."reward"),0)'
					, 'points']
				, 'Residents.facebookId'
				, 'Residents.name']
			, include: [{ model: taskDao, as: 'fulfilledTasks'}]
			, group: ['Residents.id']
			, order: '"points" DESC'
		}, {raw: true})
		.success(function(ranks) {
			return success(ranks);
		})
		.error(function queryError(err) {
			error(err);
		});

	});
}

module.exports = {
	getRankingListForCommunity: getRankingListForCommunity
};