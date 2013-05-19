/** Class: Rank.Controller
 * Ranking-related CRUD
 */

var errors = require('./errors');

/** Function: index
 * Show the ranking of the community
 *
 * Parameters:
 *   (Function) success - Callback on success
 *   (Function) error - Callback in case of an error
 *   (Object) data - An object containing the information for creation of a new
 *                   community.
 */

function index(success, error, slug) {
	var community = this.res.locals.community
		, db = this.app.get('db');

	if (community.slug !== slug) {
		var unauthorized = new errors.createError(401, 'Unauthorized');
		return error(unauthorized);
	}

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
			, group: ['"Tasks"."fulfillorId"', 'Fulfillor.id']
			, order: '"points" DESC'
		})
		.success(function(ranks) {
			this.dataStore.set('ranks', ranks);
			return success(ranks);
		})
		.error(function queryError(error) {
			return error(errors.createError(500, 'Inernal Server Error'));
		});

	});
}


module.exports = {
	index: index
};