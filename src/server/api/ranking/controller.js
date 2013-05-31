/** Class: Api.Ranking.Controller
 * Ranking-related CRUD
 */

var debug = require('debug')('roomies:api:ranking:controller')
	, errors = require('./errors');

/** PrivateFunction: getTaskDao
 * Shortcut function to get the data access object for task entities.
 *
 * Returns:
 *     (Object) sequelize data access object for task entities.
 */
function getTaskDao() {
	debug('get task dao');

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
	debug('get resident dao');

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
	debug('get ranking lists for community');

	var self = this
		, community = self.req.community

		/* AnonymousFunction: forwardError
		 * Forwards an error object using the error callback argument
		 */
		, forwardError = function forwardError(err) {
			debug('forward error');
			return error(err);
		}

		, afterResidentsSearch = function afterResidentsSearch(residents) {
			debug('after residents search');

			if (!residents) {
				var noResidentInCommunityError =
					new errors.NoResidentInCommunityError(
						'This community does not seem to have any residents');
				return forwardError(noResidentInCommunityError);
			}

			var taskDao = getTaskDao.call(self)
				, residentDao = getResidentDao.call(self);

			residentDao.findAll({
				attributes: [['COALESCE(SUM("fulfilledTasks"."reward"),0)'
						, 'points']
					, 'Residents.facebookId'
					, 'Residents.name']
				, include: [{ model: taskDao, as: 'fulfilledTasks'}]
				, group: ['Residents.id']
				, order: '"points" DESC'
			}, { raw: true })
			.success(function(rankings) {
				return success(rankings);
			})
			.error(forwardError);

		}

	community.getResidents({ where: { enabled: true } })
		.success(afterResidentsSearch)
		.error(forwardError);
}

module.exports = {
	getRankingListForCommunity: getRankingListForCommunity
};