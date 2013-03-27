/** Controller: Community.Controller
 *
 */

var path = require('path')
	, validatorsPath = path.join('..', '..', 'shared', 'validators')
	, createCommunityValidator = require(
		path.join(validatorsPath, 'create-community'));

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
console.log("resident: ", resident);
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
		title: res.__('Create a community')
	});
};

var createCommunity = function createCommunity(req, res) {
	var resident = req.user
		, Community = req.app.get('db').daoFactoryManager.getDAO('Community')
		, communityData = {
			name: req.param('name')
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
							.success(function setResult() {
								req.flash('success',
									res.__('Community created successfully.'));
								return res.redirect('/community');
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

/** Function: create
 *
 * Parameters:
 *     (Request) req - Request
 *     (Response) res - Response
 *
 * TODO: Ugly.
 */
exports.create = {
	middleware: createCommunityValidator,
	fn: createCommunity
};
