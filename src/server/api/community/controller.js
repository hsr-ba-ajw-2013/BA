/** Class: Community.Controller
 * Community-related CRUD
 *

var path = require('path')
	//, validatorsPath = path.join('..', '..', 'shared', 'validators')
	//, createCommunityValidator = require(
	//	path.join(validatorsPath, 'create-community'))
	//, utils = require(path.join(
	//		process.cwd(), 'src', 'shared', 'utils', 'index.js'))
	, uslug = require('uslug')

	, ExceptionCreateUniqueShareLink = function(message) {
		this.message = message;
		this.name = "ExceptionCreateUniqueShareLink";
		Error.call(this, message);
	};

//require('util').inherits(ExceptionCreateUniqueShareLink, Error);
*/

var /*path = require('path')*/
	errors = require('./errors')
	, uslug = require('uslug')
	, utils = require('../utils')
	, _ = require('underscore');

/** PrivateFunction: getCommunityDao
 * Shortcut function to get the data access object for community entities.
 *
 * Returns:
 *     (Object) sequelize data access object for community entities.
 */
function getCommunityDao() {
	var db = this.app.get('db')
		, communityDao = db.daoFactoryManager.getDAO('Community');

	return communityDao;
}

/** PrivateFunction: createUniqueShareLink
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
					return done('Could not create sharelink (too many tries)');
				}
				return createUniqueShareLink(db, --tries, done);
			}
			return done(null, link);
		})
		.error(function findError(err) {
			return done(err);
		});
}

/** PrivateFunction: createUniqueSlug
 * Creates a unique slug for a community. The slug is a URL fragment which
 * will identify the community.
 *
 * Parameters:
 *   (Sequelize) db - Instance of sequelize
 *   (String) communityName - Name of the community
 *   (String) communityId - ID of the community
 *   (Function) done - Callback for passing the slug. If no error occured, the
 *                     first argument will be undefined, the second one will
 *                     contain the slug. On error, the first argument contains
 *                     the error object.
 */
function createUniqueSlug(db, communityName, communityId, done) {
	var slug = uslug(communityName)
		, Community = db.daoFactoryManager.getDAO('Community');

	Community.count({ where: { slug: slug }})
		.success(function countResult(c) {
			if (c !== 0) {
				slug = uslug(communityName + " " + communityId);
			}

			done(undefined, slug);
		})
		.error(function errorCount(err) {
			done(err);
		});
}

/** PrivateFunction: updateResidentsCommunityMembership
 *
 */
 function updateResidentsCommunityMembership(resident, community, done) {
	resident.setCommunity(community)
		.success(function setResult() {
			resident.isAdmin = true;
			resident.save().success(function setAdmin() {
				done();
			}).error(function setAdminError() {
				done(new Error('Could not save administrator setting.'));
			});
		})
		.error(function() {
			done(new Error('Could not save community membership.'));
		});
 }

/** Function: createCommunity
 * Creates a community using the given data
 *
 * Parameters:
 *   (Function) success - Callback on success
 *   (Function) error - Callback in case of an error
 *   (Object) data - An object containing the information for creation of a new
 *                   communigy.
 */
function createCommunity(success, error, data) {
	utils.checkPermissionToAccess(this.req);

	var resident = this.req.user
		, db = this.app.get('db')
		, communityDao = getCommunityDao.call(this)
		, communityData = {
			name: data.name
		};

	createUniqueShareLink(db, function(err, link) {
		if (err) {
			return error(err);
		}
		communityData.shareLink = link;

		if (resident.CommunityId > 0) {
			var alreadyErr = new errors.ResidentAlreadyInCommunityError(
				'Creation of community not allowed for resident which is ' +
				'an inhabitant of an existing community.');
			return error(alreadyErr);
		}

		communityDao.find({ where: { name: communityData.name }})
			.success(function findResult(community) {
				if (community !== null) {
					var alreadyExistsErr =
						new errors.CommunityAlreadyExistsError(
							'A community with the name "' + communityData.name +
							'" already exists.');
					return error(alreadyExistsErr);
				}

				communityDao.create(communityData)
					.success(function createResult(community) {

						createUniqueSlug(db, community.name, community.id
							, function(err, slug) {
								if(err) {
									return error(err);
								}

								community.slug = slug;
								community.save()
									.success(function saved() {
										updateResidentsCommunityMembership(
											resident, community, function(err) {
												if(err) {
													error(err);
												} else {
													success();
												}
										});
								})
								.error(function saveError() {
									return error();
								});
						});

					}).error(function createError() {
						return error();
					});
			})
			.error(function findError() {
				return error();
			});
	});
}

/** Function: getCommunityWithSlug
 * Looks up a community with a specific slug.
 *
 * Parameters:
 *   (Function) success - Callback on success. Will pass the community data as
 *                        first argument.
 *   (Function) error - Callback in case of an error
 *   (String) slug - The slug of the community to look for.
 */
function getCommunityWithSlug(success, error, slug) {
	utils.checkPermissionToAccess(this.req);

	var communityDao = getCommunityDao.call(this);

	communityDao.find({ where: { slug: slug }})
		.success(function findResult(community) {
			if(!_.isNull(community)) {
				success(community);
			} else {
				error(new errors.NotFoundError('Community with slug ' + slug +
					'does not exist.'));
			}
		})
		.error(function daoError(err) {
			error(err);
		});
}

/** Function: deleteCommunity
 * Marks a community as deactivated with a specific slug.
 *
 * Parameters:
 *   (Function) success - Callback on success.
 *   (Function) error - Callback in case of an error
 *   (String) slug - The slug of the community to look for.
 */
function deleteCommunity(success, error, slug) {

}


module.exports = {
	getCommunityWithSlug: getCommunityWithSlug
	, createCommunity: createCommunity
	, deleteCommunity: deleteCommunity
};









/** PrivateFunction: renderIndex
 * Renders a Community instance in a specific response object.
 *
 * Parameters:
 *    (Request) req - Request
 *    (Response) res - The response to render into
 *    (Community) community - The actual Community instance to render
 *
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
 *   (Request) req - Request
 *   (Response) res - Response
 *
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

};*/

/** Function: fresh
 * Renders a form for creating a new (fresh) community.
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 *
exports.fresh = function freshView(req, res) {
	res.render('community/views/fresh', {
		title: res.__('Create a community')
	});
};*/




/** Function: create
 * Validates the POSTed form using <createCommunityValidator> as a middleware.
 * If the form has been valid, it will use the <createCommunity> function
 * to create a community.
 *
//exports.create = [createCommunityValidator, createCommunity];

/** Function: invite
 * Show the invite page. So can share the community with some roomies. YAAY :)
 *
 * /community/:slug/invite GET
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 *
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
		/*jshint unused:false*
		res.send(405);  // respond with "method not allowed"
//};
*/