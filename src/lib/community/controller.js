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
function renderIndex(req, res, community) {
	res.render('community/views/index', {
		title: res.__('Your community %s', community.name)
	});
}

/** Function: index
 * In case the resident has no community assigned yet, it will redirect
 * to <new>.
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 */
exports.index = function index(req, res) {
	var community = res.locals.community;

	return renderIndex(req, res, community);
};

/** Function: fresh
 * Renders a form for creating a new (fresh) community.
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
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
 *   (Request) req - Request
 *   (Response) res - Response
 */
function createCommunity(req, res) {
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
					return res.redirect('/community/new');
				}
				Community.create(communityData)
					.success(function createResult(community) {

						addUniqueSlug(db, community, function(err) {
							if(err) {
								return res.send(500);
							}
							resident.setCommunity(community)
								.success(function setResult() {
									resident.isAdmin = true;
									resident.save().success(function() {
										req.flash('success',
											res.__('Community \'%s' +
												'\' created successfully.'
												, community.name));
										return res.redirect('/community/' +
											community.slug + '/invite');
									})
									.error(function() {
										res.send(500);
									});
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
}


/** Function: create
 * Validates the POSTed form using <createCommunityValidator> as a middleware.
 * If the form has been valid, it will use the <createCommunity> function
 * to create a community.
 */
exports.create = [createCommunityValidator, createCommunity];

/** Function: del
 * Delete the community is the user has right to do it.
 */
exports.del = function handlePost(req, res) {
	var resident = req.user
		, communitySlugToDelete = req.param('community');

	if (!resident.isAdmin) {
		req.flash('error',
			res.__('You do not have sufficient rights ' +
				'to perform this operation.'));
		return res.status(403).redirect('back');
	}

	resident.getCommunity()
		.success(function successResult(residentCommunity) {
			if (residentCommunity &&
				communitySlugToDelete === residentCommunity.slug) {

				residentCommunity.enabled = false;
				residentCommunity.save().success(function saveSuccess() {
					req.flash('success',
						res.__('The community was successfully deleted.'));
					return res.redirect('/');
				})
				.error(function() {
					res.send(500);
				});
			} else {
				req.flash('error',
					res.__('You do not have sufficient rights ' +
						'to perform this operation.'));
				return res.status(403).redirect('back');
			}
		})
		.error(function getError() {
			return res.send(500);
		});
};

/** Function: invite
 * Show the invite page. So can share the community with some roomies. YAAY :)
 *
 * /community/:slug/invite GET
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
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

exports.get = exports.update =
	function(req, res) {
		/*jshint unused:false*/
		res.send(405);  // respond with "method not allowed"
};
