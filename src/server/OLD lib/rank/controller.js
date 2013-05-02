/** Controller: Rank.Controller
 * Rank Controller
 */

var _ = require('underscore');

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

	db = db;

	resident.getCommunity().success(function result(community) {

		if (!community) {
			return res.redirect('/community/new');
		}

		var ranks = [];

		community.getResidents().success(function residentsResult(residents) {

			if (!residents) {
				req.flash('error', 'An error occurred.');
				return res.redirect('..');
			}

			for (var i = 0; i < residents.length; i++) {

				var curResident = residents[i]
					, rankData = {
						resident: curResident
						, points: Math.round(10*Math.random())
						, badges: Math.round(10*Math.random())
					};

				/*db.query(
					'SELECT SUM(reward) ' +
					'FROM "Tasks" ' +
					'WHERE \'fulfillorId\' = \'' + curResident.id + '\'' +
					'AND \'fulfilledAt\' >= ' +
					'cast((current_date - interval \'7 days\') as TIMESTAMP)')
					.success(function(rows) {
						console.log(JSON.stringify(rows))

				})
				.error(function queryError(error) {
					console.log(error);
				});*/

				ranks[ranks.length] = rankData;
			}

			ranks = _(ranks).sortBy(function sortByPoints(rank) {
				return -(1000*rank.points + rank.badges);
			});

			res.render('rank/views/index', {
				title: res.__('Tasks')
				, ranks: ranks
			});

		});

	});
};
