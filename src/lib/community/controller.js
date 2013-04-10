/** Controller: Community.Controller
 * Community-related CRUD
 */

var path = require('path')
	, validatorsPath = path.join('..', '..', 'shared', 'validators')
	, createCommunityValidator = require(
		path.join(validatorsPath, 'create-community'))
	, utils = require(path.join(
			process.cwd(), 'src', 'shared', 'utils', 'index.js'))
	, uslug = require('uslug')

	, ExceptionCreateUniqueShareLink = function(message) {
		this.message = message;
		this.name = "ExceptionCreateUniqueShareLink";
		Error.call(this, message);
	};

require('util').inherits(ExceptionCreateUniqueShareLink, Error);

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

/** Function: createUniqueShareLink
 * Creates a random share link.
 *
 * Parameters:
 *   (Sequelize) db - Instance of sequelize
 *   (Function) done - Callback to call after creating the sharelink
 *                     (successfully or not)
 *   (number) tries - [optional] [Default = 1] The number of tries if the link
 *                                              already exists
 */
function createUniqueShareLink(db, done, tries) {
	var Community = db.daoFactoryManager.getDAO('Community')
		, link = utils.randomString(12);

	tries = tries || 1;

	Community.find({ where: { shareLink: link }})
		.success(function findResult(community) {
			if (community) {
				if (tries - 1 <= 0) {
					return done(
						new ExceptionCreateUniqueShareLink('Too many tries'));
				}
				return createUniqueShareLink(db, --tries, done);
			}
			return done(null, link);
		})
		.error(function findError(err) {
			return done(err);
		});
}
exports.createUniqueShareLink = createUniqueShareLink;

/** Function: addUniqueSlug
 * Creates a unique slug for a community.
 *
 * Parameters:
 *   (Sequelize) db - Instance of sequelize
 *   (Community) community - Community model
 *   (Function) done - Callback to call after creating the sharelink
 *                     (successfully or not)
 */
function addUniqueSlug(db, community, done) {
	var slug = uslug(community.name)
		, Community = db.daoFactoryManager.getDAO('Community');

	Community.count({ where: { slug: slug }})
		.success(function countResult(c) {
			if (c !== 0) {
				slug = uslug(community.name + " " + community.id);
			}

			community.slug = slug;
			community.save()
				.success(function saved() {
					done(null, slug);
				})
				.error(function saveError(err) {
					done(err);
				});
		})
		.error(function errorCount(err) {
			done(err);
		});
}
exports.addUniqueSlug = addUniqueSlug;

/** PrivateFunction: createCommunity
 * Creates a community.
 *
 * Parameters:
 *   (express.request) req - Request
 *   (express.response) res - Response
 */
var createCommunity = function createCommunity(req, res) {
	var resident = req.user
		, db = req.app.get('db')
		, Community = db.daoFactoryManager.getDAO('Community')
		, communityData = {
			name: req.param('name')
		};

	createUniqueShareLink(db, function(err, link) {
		if (err) {
			return res.send(500);
		}
		communityData.shareLink = link;

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
				}
				Community.create(communityData)
					.success(function createResult(community) {

						addUniqueSlug(db, community, function(err) {
							if(err) {
								return res.send(500);
							}
							resident.setCommunity(community)
								.success(function setResult() {
									req.flash('success',
										res.__('Community \'' + community.name +
											'\' created successfully.'));
									return res.redirect('/community/' +
										community.slug + '/invite');
								})
								.error(function() {
									res.send(500);
								});
						});

					}).error(function createError() {
						return res.send(500);
					});
			})
			.error(function findError() {
				return res.send(500);
			});
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
							title: res.__('Invite your roomies' +
								' to the community!')
							, shareLink: "/invite/" + community.shareLink
						});
			} else {
				req.flash('error',
							res.__('The community you wanted' +
								' to share does not exist.'));
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
