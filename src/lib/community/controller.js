/** Controller: Community.Controller
 * Community-related CRUD
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

/** Function: index
 * In case the resident has no community assigned yet, it will redirect
 * to <new>.
 *
 * Parameters:
 *   (express.request) req - Request
 *   (express.response) res - Response
 */
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

/** Function: fresh
 * Renders a form for creating a new community.
 *
 * Parameters:
 *   (express.request) req - Request
 *   (express.response) res - Response
 */
exports.fresh = function newView(req, res) {
	res.render('community/views/new', {
		title: res.__('Create a community')
	});
};

/** PrivateFunction: createRandomString
 * Creates a random string.
 *
 * Parameters:
 *   (number) size - Request
 *   (express.response) res - Response
 */
var createRandomString = function createRandomString(size, possible) {
	var text = "";

	possible = possible || "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
							"abcdefghijklmnopqrstuvwxyz0123456789";
	size = size || 12;

	for( var i=0; i < size; i++ ) {
		text += possible.charAt(
					Math.floor(Math.random() * possible.length));
	}
	return text;
};

/** PrivateFunction: createUniqueShareLink
 * Creates a random share link.
 *
 * Parameters:
 *   (express.request) req - Request
 *   (express.response) res - Response
 *   (number [optional] [Default = 1])
		tries - The number of tries if the link already exists
 */
var createUniqueShareLink = function createUniqueShareLink(req, res, tries) {
	var Community = req.app.get('db').daoFactoryManager.getDAO('Community')
		, link = ""
		, possible = "abcdefghijklmnopqrstuvwxyz0123456789";

	tries = tries || 1;
	link = createRandomString(17, possible);

	Community.find({ where: { shareLink: link }})
		.success(function findResult(community) {
			if (community) {
				if (tries - 1 <= 0) {
					return null;
				} else {
					return createUniqueShareLink(req, res, --tries);
				}
			}
		})
		.error(function findError() {
			return null;
		});

	return link;
};

/** PrivateFunction: createCommunity
 * Creates a community.
 *
 * Parameters:
 *   (express.request) req - Request
 *   (express.response) res - Response
 */
var createCommunity = function createCommunity(req, res) {
	var resident = req.user
		, Community = req.app.get('db').daoFactoryManager.getDAO('Community')
		, communityData = {
			name: req.param('name')
			, shareLink: createUniqueShareLink(req, res)
		};

	Community.find({ where: { name: communityData.name }})
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
 * Validates the POSTed form using <createCommunityValidator> as a middleware.
 * If the form has been valid, it will use the <createCommunity> function
 * to create a community.
 *
 * Parameters:
 *     (Request) req - Request
 *     (Response) res - Response
 */
exports.create = [createCommunityValidator, createCommunity];

/**
 * TODO
 */
exports.get = exports.update = exports.invite = exports.del =
	function(req, res) {
		req = req;//FIXME REMOVE !! JSHINT IN YA FACE.
		res.send(404);
};
