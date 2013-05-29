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

	community.getResidents().success(function residentsResult(residents) {
		if (!residents) {
			var noResidentInCommunityError =
				new errors.NoResidentInCommunityError(
					'No Residents where found in the community');
			return error(noResidentInCommunityError);
		}

		var residentIds = residents.map(function getResidentIds(curResident) {
			return curResident.id;
		});

		var taskDao = getTaskDao.call(self)
			, residentDao = getResidentDao.call(self)
			, today = new Date()
			, lastWeek = new Date(today.getTime()-1000*60*60*24*7);

//TODO:
//SELECT SUM("Tasks"."reward") AS "points", "Residents"."id"
//FROM "Residents"
//LEFT JOIN "Tasks" ON "Residents"."id" = "Tasks"."fulfillorId"
//GROUP BY "Residents"."id"

		taskDao.findAll({
			attributes: [['SUM("reward")', 'points'], 'fulfillorId']
			, include: [{ model: residentDao, as: 'Fulfillor' }]
			, where:
				['"Tasks"."fulfillorId" IN (' + residentIds.join(',') + ') ' +
					'AND "Tasks"."fulfilledAt" >= ?', lastWeek]
			, group: ['Tasks.fulfillorId', 'Fulfillor.id']
			, order: '"points" DESC'
		})
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