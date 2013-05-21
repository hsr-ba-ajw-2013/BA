/** Class: Api.Rank.Controller
 * Ranking-related CRUD
 */

var errors = require('./errors');

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
	var community = this.community
		, db = this.app.get('db');

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

		var Task = db.daoFactoryManager.getDAO('Task')
			, Resident = db.daoFactoryManager.getDAO('Resident')
			, today = new Date()
			, lastWeek = new Date(today.getTime()-1000*60*60*24*7);

		Task.findAll({
			attributes: [['SUM("reward")', 'points'], 'fulfillorId']
			, include: [{ model: Resident, as: 'Fulfillor' }]
			, where:
				['"Tasks"."fulfillorId" IN (' + residentIds.join(',') + ') ' +
					'AND "Tasks"."fulfilledAt" >= ?', lastWeek]
			, group: ['Tasks.fulfillorId', 'Fulfillor.id']
			, order: '"points" DESC'
		}, {'raw': true})
		.success(function(ranks) {
			// TODO: ??
			//self.dataStore.set('ranks', ranks);
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