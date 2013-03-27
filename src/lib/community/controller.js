/** Controller: Community.Controller
 *
 */

/** PrivateFunction: renderIndex
 * Renders a Community instance in a specific response object.
 *
 * Parameters:
 *    (Request) req - Request
 *    (Response) res - The response to render into
 *    (Community) community - The actual Community instance to render
 */
var renderIndex = function renderIndex(req, res, community) {
	res.render('community/views/index', {
		title: res.__('Your community %s', community.name)
	});
};

exports.index = function index(req, res) {
	var resident = req.user;

	resident.getCommunity().success(function result(community) {
		if (!community) {
			return res.redirect('./new');
		}
		return renderIndex(req, res, community);
	}).error(function() {
		return res.redirect('./new');
	});

};


exports['new'] = function newView(req, res) {
	res.render('community/views/new', {
		title: res.__('Create Community'),
		flash: req.flash()
	});
};

/** Function: createPost
 *
 * Parameters:
 *     (Request) req - Request
 *     (Response) res - Response
 */
exports.create = function create(req, res) {
	var resident = req.user
		, Community = req.app.get('db').daoFactoryManager.getDAO('Community');

	//TODO: validate POST

	var communityData = {
			name: req.body.name
	};

	console.log(communityData);

	Community.find({ where: communityData })
		.success(function findResult(community) {
			if (community !== null) {
				req.flash('error', "OH NO!!!");
				res.redirect('back');
			} else {
				console.log('yoyoo');
				Community.create(communityData)
					.success(function createResult(community) {
						console.log("community created: ", community);
						console.log("---: ", resident);

						resident.setCommunity(community)
							.success(function setResult(result) {
								console.log(result);
								console.log("community has resident");
								req.flash('success',
									req.__('Community created successfully.'));
								res.redirect('./');
							});

					}).error(function createError() {
						res.send(500);
					});
			}
		})
		.error(function findError() {
			res.send(500);
		});
};
