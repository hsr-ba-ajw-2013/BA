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
	var resident = req.user
		, db = req.app.get('db');

	resident.getCommunity().success(function result(community) {

		if (!community) {
			return res.redirect('/community/new');
		}

		community.getResidents().success(function residentsResult(residents) {

			if (!residents) {
				req.flash('error', res.__('An error occurred.'));
				return res.redirect('..');
			}

			db.query(
				'SELECT DISTINCT ' +
					'SUM(t.reward) AS points ' +
					', r."facebookId" ' +
					', r."name" ' +
				'FROM "Tasks" t, "Residents" r ' +
				'WHERE t."fulfillorId" = r."id" ' +
					'AND t."fulfilledAt" >= ' +
						'(current_date - interval \'7 days\') ' +
				'GROUP BY t."fulfillorId", r."id" ' +
				'ORDER BY points DESC'
			)
			.success(function(ranks) {
				console.log(ranks);

				res.render('rank/views/index', {
					title: res.__('Tasks')
					, ranks: ranks
				});

			})
			.error(function queryError(error) {
				console.log(error);
			});

		});

	});
};
