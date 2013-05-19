/** Class: Rank.Controller
 * Ranking-related CRUD
 */

var errors = require('./errors');

function index(success, error) {
	var community = this.res.locals.community
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
			, group: ['"Tasks"."fulfillorId"', 'Fulfillor.id']
			, order: '"points" DESC'
		})
		.success(function(ranks) {
			this.dataStore.set('ranks', ranks);
			return success();
		})
		.error(function queryError(error) {
			return error(errors.createError(500, 'Inernal Server Error'));
		});

	});
}


module.exports = {
	index: index
};