/** Class: Api.Community.Controller
 * This controller contains plain CRUD logic for interacting with the community
 * domain objects. It is part of the API.
 */
var errors = require('./errors')
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
	debug('get community DAO');

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
	debug('create unique share link');

	var Community = db.daoFactoryManager.getDAO('Community')
		, link = utils.randomString(12);

	tries = tries || 1;

	Community.find({ where: { shareLink: link, enabled: true }})
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
	debug('create unique slug');

	var slug = uslug(communityName)
		, Community = db.daoFactoryManager.getDAO('Community');

	Community.count({ where: { slug: slug, enabled: true }})
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
 * Sets the community of the given resident.
 *
 * Parameters:
 *     (Object) resident - The resident to update
 *     (Object) community - The community to be set for the resident
 *     (Function) done - Called on completion. If an error happend, the first
 *                       argument will be the regarding error object.
 */
function updateResidentsCommunityMembership(resident, community, done) {
	debug('update residents community membership');

	resident.setCommunity(community)
		.success(function setResult() {
			resident.isAdmin = true;
			resident.save()
				.success(function setAdmin() {
					done();
				})
				.error(function setAdminError() {
					done(new Error('Could not save administrator setting.'));
				}
			);
		})
		.error(function() {
			done(new Error('Could not save community membership.'));
		});
 }

 /** PrivateFunction: setCommunityDisabled
 * Set the property 'enabled' of a given community to false
 *
 * Parameters:
 *   (Object) community - the community to disable
 *   (Function) done - Callback for continuing the job.
 *                     On error, the first argument contains
 *                     the error object.
 */
function setCommunityDisabled(community, done) {
	debug('set community disabled');

	community.enabled = false;

	community.save()
		.success(function saveSuccess() {
			done(null, community);
		})
		.error(function saveError() {
			done(new Error('Could not save community.'));
		});
}

/** PrivateFunction: removeResidentsFromCommunity
 * Removes all residents of the given community & sets the isAdmin property
 * of them to false.
 *
 * Parameters:
 *   (Object) community - The community which has been disabled
 *   (Function) done - Callback for continuing the job.
 *                     On error, the first argument contains
 *                     the error object.
 */
function removeResidentsFromCommunity(community, done) {
	debug('remove residents from community');

	community.getResidents().success(function(residents) {
		var residentCount = residents.length,
			residentsRemoved = 0;
		function doneIfAllSuccessful() {
			if(residentCount === residentsRemoved) {
				done();
			}
		}
		function success() {
			++residentsRemoved;
			doneIfAllSuccessful();
		}
		function error() {
			done(new Error('Could not save resident.'));
		}
		for(var i = 0; i < residentCount; i++) {
			var resident = residents[i];
			resident.isAdmin = false;
			resident.CommunityId = 0;
			resident.save().success(success)
			.error(error);
		}
	}).error(function getError() {
		done(new Error('Could not fetch residents'));
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
	debug('create community');

	var self = this
		, resident = self.req.user
		, db = self.app.get('db')
		, eventbus = self.app.get('eventbus')
		, communityDao = getCommunityDao.call(self)
		, communityData = {
			name: data.name
		}

		/* AnonymousFunction: forwardError
		 * Forwards an error object using the error callback argument
		 */
		, forwardError = function forwardError(err) {
			debug('forward error');
			return error(err);
		}

		/* AnonymousFunction: afterCommunitySearch
		 * After looking for an existing community, this function creates a new
		 * community if not already existing.
		 */
		, afterCommunitySearch = function afterCommunitySearch(community) {
			debug('after community search');

			if (community !== null) {
				var alreadyExistsErr =
					new errors.CommunityAlreadyExistsError(
						'A community with the name "' + communityData.name +
						'" already exists.');
				return forwardError(alreadyExistsErr);
			}

			communityDao.create(communityData)
				.success(afterCommunityCreate)
				.error(forwardError);
		}

		/* AnonymousFunction: afterCommunityCreate
		 * After successfull creation of a community, a community slug is
		 * created. The slug is then saved into the community.
		 */
		, afterCommunityCreate = function afterCommunityCreate(community) {
			debug('after community create');

			createUniqueSlug(db, community.name, community.id
				, function(err, slug) {
					if(err) {
						return forwardError(err);
					}

					community.slug = slug;
					community.save()
						.success(afterUpdateCommunitySlug)
						.error(forwardError);
				});
		}

		/* AnonymousFunction: afterUpdateCommunitySlug
		 * After the successful update of the community with its new slug, this
		 * function emits a "community:created" event on the eventbus and the
		 * success callback argument is called.
		 */
		, afterUpdateCommunitySlug =
			function afterUpdateCommunitySlug(community) {
				debug('after update community slug');

				updateResidentsCommunityMembership(
					resident
					, community
					, function(err) {
						if(err) {
							return forwardError(err);
						}

						eventbus.emit('community:created', community);
						success(community.dataValues);
					}
				);
		};

	createUniqueShareLink(db, function(err, shareLink) {
		if (err) {
			return error(err);
		}
		communityData.shareLink = shareLink;

		if (resident.CommunityId > 0) {
			var alreadyErr = new errors.ResidentAlreadyInCommunityError(
				'Creation of community not allowed for resident which is ' +
				'an inhabitant of an existing community.');
			return error(alreadyErr);
		}

		communityDao.find({ where: { name: communityData.name, enabled: true }})
			.success(afterCommunitySearch)
			.error(forwardError);
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

	var communityDao = getCommunityDao.call(this)

		/* AnonymousFunction: forwardError
		 * Forwards an error object using the error callback argument
		 */
		, forwardError = function forwardError(err) {
			return error(err);
		}

		/* AnonymousFunction: afterCommunitySearch
		 * Calls the success or error callback after searching for a community.
		 */
		, afterCommunitySearch = function afterCommunitySearch(community) {
			if(!_.isNull(community)) {
				success(community.dataValues);
			} else {
				forwardError(new errors.NotFoundError(
					'Community with id ' + id + 'does not exist.')
				);
			}
		};

	communityDao.find({ where: { id: id, enabled: true }})
		.success(afterCommunitySearch)
		.error(forwardError);
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

	communityDao.find({ where: { slug: slug, enabled: true }})
		.success(function findResult(community) {
			if(!_.isNull(community)) {
				success(community.dataValues);
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
 * Marks the community with the slug from data.slug as disabled which means it
 * is actually deactivated.
 *
 * Parameters:
 *   (Function) success - Callback on success
 *   (Function) error - Callback in case of an error
 *   (Object) data - Information about the community to delete
 */
function deleteCommunity(success, error, data) {
	debug('delete community with slug');

	var self = this
		, resident = self.req.user
		, eventbus = self.app.get('eventbus')

		/* AnonymousFunction: forwardError
		 * Forwards an error object using the error callback argument
		 */
		, forwardError = function forwardError(err) {
			debug('forward error');
			return error(err);
		}

		/* AnonymousFunction: afterCommunitySearch
		 * After looking for a community, this function tries to setting the
		 * community to disabled.
		 */
		, afterCommunitySearch = function afterCommunitySearch(community) {
			debug('after community search');

			if (community && data.slug === community.slug) {
				setCommunityDisabled(community, afterSettingCommunityDisabled);
			} else {
				return forwardError(
					new errors.ForbiddenError('Not Authorized!'));
			}
		}

		/* AnonymousFunction: afterSettingCommunityDisabled
		 * Tries to remove the current resident from the community which should
		 * be deleted.
		 */
		, afterSettingCommunityDisabled =
			function afterSettingCommunityDisabled(err, community) {
				debug('after setting community disabled');

				if(err) {
					return forwardError(err);
				}

				removeResidentsFromCommunity(
					community
					, afterRemoveResidentsFromCommunity
				);
		}

		/* AnonymousFunction: afterCommunitySearch
		 * If no error occured, this function emits a "community:deleted" event
		 * on the event bus and calls the success callback argument.
		 */
		, afterRemoveResidentsFromCommunity =
			function afterRemoveResidentsFromCommunity(err) {
				debug('after remove residents from community');

				if(err) {
					return forwardError(err);
				}

				eventbus.emit('community:deleted');
				success();
		};

	if (!resident.isAdmin) {
		return forwardError(new errors.ForbiddenError('Not Authorized!'));
	}

	resident.getCommunity({ where: { enabled: true } })
		.success(afterCommunitySearch)
		.error(forwardError);
}


/** Function: getCommunityWithShareLink
 * Gets community from a shareLink
 *
 * Parameters:
 *   (Function) success - Callback on success.
 *   (Function) error - Callback in case of an error
 *   (String) shareLink - The community's shareLink
 */
function getCommunityWithShareLink(success, error, shareLink) {
	var resident = this.req.user
		, communityDao = getCommunityDao.call(this);
	if (resident.isInACommunity()) {
		return error(new errors.ResidentAlreadyInCommunityError(
			'You already are in a community'));
	}
	communityDao.find({ where: {shareLink: shareLink, enabled: true}})
		.success(function findResult(community) {
			if (community !== null) {
				success(community.dataValues);
			} else {
				error(new errors.InvalidShareLink('Share link invalid'));
			}
		})
		.error(function createError(err) {
			error(err);
		});
}

/** Function: joinCommunity
 * Joins a community
 *
 * Parameters:
 *   (Function) success - Callback on success.
 *   (Function) error - Callback in case of an error
 *   (String) slug - The community's slug
 *   (Object) data - POST data
 */
function joinCommunity(success, error, slug, data) {
	debug('join community');
	var shareLink = data.shareLink
	, resident = this.req.user
	, communityDao = getCommunityDao.call(this)
	, eventBus = this.app.get('eventbus');

	communityDao.find({ where: {
		slug: slug
		, shareLink: shareLink
		, enabled: true
	}}).success( function findResult(community) {
		if(!community) {
			return error(
				new errors.ValidationError('Combination of params wrong'));
		}
		resident.setCommunity(community)
			.success(function setResult() {
				eventBus.emit('community:joined');
				return success(community.dataValues);
			})
			.error(function(err) {
				return error(err);
			});

	})
	.error(function createError(err) {
		return error(err);
	});
}

module.exports = {
	getCommunityWithId: getCommunityWithId
	, getCommunityWithSlug: getCommunityWithSlug
	, createCommunity: createCommunity
	, deleteCommunity: deleteCommunity
	, joinCommunity: joinCommunity
	, getCommunityWithShareLink: getCommunityWithShareLink
};