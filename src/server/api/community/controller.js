/** Class: Api.Community.Controller
 * Community-related CRUD
 */
var errors = require('./errors')
	, taskApi = require('../task/controller')
	, uslug = require('uslug')
	, utils = require('../utils')
	, debug = require('debug')('roomies:api:community:controller')
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
 *                   community.
 */
function createCommunity(success, error, data) {
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
								.error(function saveError(err) {
									return error(err);
								});
						});

					}).error(function createError(err) {
						return error(err);
					});
			})
			.error(function findError(err) {
				return error(err);
			});
	});
}

/** Function: getCommunityWithId
 * Looks up a community with a specific ID.
 *
 * Parameters:
 *   (Function) success - Callback on success. Will pass the community data as
 *                        first argument.
 *   (Function) error - Callback in case of an error
 *   (String) id - The id of the community to look for.
 */
function getCommunityWithId(success, error, id) {
	debug('get community with id');
	var communityDao = getCommunityDao.call(this);

	communityDao.find({ where: { id: id }})
		.success(function findResult(community) {
			if(!_.isNull(community)) {
				success(community);
			} else {
				error(new errors.NotFoundError('Community with id ' + id +
					'does not exist.'));
			}
		})
		.error(function daoError(err) {
			error(err);
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
	debug('get community with slug');
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

/** Function: getTasksForCommunityWithSlug
 * Returns all tasks for the community with the given slug. In case the
 * community slug was not found or the given community does not have any tasks
 * assigned at the moment, a NotFoundError gets returned.
 *
 * Parameters:
 *   (Function) success - Callback on success. Will pass the tasks as first
 *                        argument.
 *   (Function) error - Callback in case of an error
 *   (String) slug - The slug of the community to look for.
 */
function getTasksForCommunityWithSlug(success, error, slug) {
	debug('get tasks for community with slug');
	var communityDao = getCommunityDao.call(this)
		, self = this;

	communityDao.find({ where: { slug: slug }})
		.success(function findCommunity(community) {
			if(!_.isNull(community)) {
				if(community.id !== self.req.user.CommunityId) {
					return error(
						new errors.ForbiddenError('Invalid Community'));
				}
				community.getTasks({ order: 'id DESC' })
					.success(function findTasks(tasks) {
						if(!_.isNull(tasks) && tasks.length > 0) {
							success(tasks);
						} else {
							error(new errors.NoTasksFoundError(
								'No tasks found for community with slug `' +
								slug + '`.'));
						}
					})
					.error(function daoError(err) {
						error(err);
					});
			} else {
				error(new errors.NotFoundError('Community with slug ' + slug +
					'does not exist.'));
			}
		})
		.error(function daoError(err) {
			error(err);
		});
}

function createTaskForCommunityWithSlug(success, error, slug, task) {
	taskApi.createTask.call(this, success, error, task);
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
	/* jshint unused: false */
}


module.exports = {
	getCommunityWithId: getCommunityWithId
	, getCommunityWithSlug: getCommunityWithSlug
	, getTasksForCommunityWithSlug: getTasksForCommunityWithSlug
	, createTaskForCommunityWithSlug: createTaskForCommunityWithSlug
	, createCommunity: createCommunity
	, deleteCommunity: deleteCommunity
};