/** Controller: Community.Controller
 * Community-related CRUD
 */

var path = require('path')
	, validatorsPath = path.join('..', '..', 'shared', 'validators')
	, createCommunityValidator = require(
		path.join(validatorsPath, 'create-community'))
	, utils = require(path.join(
			process.cwd(), 'src', 'shared', 'utils', 'index.js'))
	, uslug = require('uslug');

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
 * Renders a form for creating a new (fresh) community.
 *
 * Parameters:
 *   (express.request) req - Request
 *   (express.response) res - Response
 */
exports.fresh = function freshView(req, res) {
	res.render('community/views/fresh', {
		title: res.__('Create a community')
	});
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
		, link = utils.randomString(12);

	tries = tries || 1;

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

var addUniqueSlug = function addUniqueSlug(req, community) {
	var slug = uslug(community.name)
		, Community = req.app.get('db').daoFactoryManager.getDAO('Community');

	Community.count({ where: { slug: slug }})
		.success(function countResult(c) {
			if (c !== 0) {
				slug = uslug(community.name + " " + community.id);
			}

			community.slug = slug;
			community.save()
				.error( function createError(errors) {
					console.log("errors: ", errors);
				});
		});
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

	if (resident.CommunityId !== null) {
		req.flash('error',
			res.__('What exactly are you trying? You\'re ' +
				'already in a community...'));
		return res.redirect('/community');
	}

	Community.find({ where: { name: communityData.name }})
		.success(function findResult(community) {
			if (community !== null) {
				req.flash('error', res.__('The community already exists.'));
				return res.redirect('./new');
			} else {
				Community.create(communityData)
					.success(function createResult(community) {

						addUniqueSlug(req, community);

						resident.setCommunity(community)
							.success(function setResult() {
								req.flash('success',
									res.__('Community \'%s\' ' +
										'created successfully.'
										, community.name));
								return res.redirect('/community/' +
									community.slug + '/invite');
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

/** Function: invite
 * Show the invite page. So can share the community with some roomies. YAAY :)
 *
 * /community/:slug/invite GET
 *
 * Parameters:
 *     (Request) req - Request
 *     (Response) res - Response
 */
exports.invite = function invite(req, res) {
	var slug = req.params.slug
		, resident = req.user
		, Community = req.app.get('db').daoFactoryManager.getDAO('Community');

	Community.find({ where: {slug: slug}})
		.success(function findResult(community) {

			if (community !== null) {

				if (resident.CommunityId !== community.id) {
					req.flash('warning',
								res.__('You are not allowed to send' +
										' invites for this community!'));
					return res.redirect('back');
				}

				return res.render('community/views/invite', {
							title: res.__('Invite some dudes to the community!')
							, shareLink: community.shareLink
						});
			} else {
				req.flash('error',
							res.__('The community you wanted' +
								' to share does not exists.'));
				return res.redirect('/');
			}
		})
		.error(function createError() {
			return res.send(500);
		});
};

exports.get = exports.update = exports.del =
	function(req, res) {
		/*jshint unused:false*/
		res.send(405);  // respond with "method not allowed"
};
