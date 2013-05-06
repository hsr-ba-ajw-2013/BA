/** Controller: Rank.Controller
 * Rank Controller
 */

/** Function: index
 * Render list of tasks
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 */
exports.index = function index(req, res) {
	var community = res.locals.community
		, db = req.app.get('db');

	community.getResidents().success(function residentsResult(residents) {

		if (!residents) {
			req.flash('error', res.__('An error occurred.'));
			return res.redirect('..');
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
			res.render('rank/views/index', {
				title: res.__('Tasks')
				, ranks: ranks
			});

		})
		.error(function queryError(error) {
			console.log(error);
		});

	});
};
