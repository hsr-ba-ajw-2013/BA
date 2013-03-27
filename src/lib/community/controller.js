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
		title: res.__('Create a community'),
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
	if (!req.body.name) {
		req.flash('error', res.__('The community name must be valid.'));
		return res.redirect('./new');
	} else if (req.body.name.length > 255) {
		req.flash('error', res.__('The community name should be smaller then 255 characters.'));
		return res.redirect('./new');
	}

	var communityData = {
			name: req.body.name.trim()
	};

	Community.find({ where: communityData })
		.success(function findResult(community) {
			if (community !== null) {
				req.flash('error', res.__('The community already exists.'));
				return res.redirect('./new');
			} else {
				Community.create(communityData)
					.success(function createResult(community) {
						resident.setCommunity(community)
							.success(function setResult(result) {
								req.flash('success',
									res.__('Community created successfully.'));
								return res.redirect('./');
							})
							.error(function(errors) {
								console.log("errors: ", errors);
							});

					}).error(function createError() {
						return res.send(500);
					});
			}
		})
		.error(function findError() {
			return res.send(500);
		});
};
