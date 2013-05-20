/** Component: Api.Community
 * The Community API component sets up the APIAdapter to interact with community
 * related domain objects.
 *
 * API Routes:
 *     GET community/:slug - Returns the community with the named url parameters
 *                           :slug.
 *     GET community/:slug/tasks - Returns all tasks which belong to the
 *                                 community with the named url parameter :slug.
 *     POST community/ - Creates a new community based upon the information
 *                       passed with the function call.
 */

var controller = require('./controller')
	, basicAuthentication = require('../policy/basicAuthentication')
	, authorizedForCommunity = require('../policy/authorizedForCommunity')
	, communityValidators = require('./validators')
	, taskValidators = require('../task/validators')
	, path = require('path')
	, utils = require('../utils')
	, modulePrefix = '/community';

module.exports = function initCommunityApi(api, apiPrefix) {
	var prefix = path.join(apiPrefix, modulePrefix);

	api.get(path.join(prefix, ':slug'), [
		basicAuthentication
		, authorizedForCommunity
		, controller.getCommunityWithSlug]);

	api.get(path.join(prefix, ':slug', 'tasks'), [
		basicAuthentication
		, authorizedForCommunity
		, controller.getTasksForCommunityWithSlug]);

	api.post(prefix, [
		basicAuthentication
		, communityValidators.createCommunity
		, controller.createCommunity
		]);

	api.app.post(modulePrefix, utils.buildFormRoute(
		'success', 'error', api, [
			communityValidators.createCommunity
			, controller.createCommunity
		]));

	api.post(path.join(prefix, ':slug', 'tasks'), [
		basicAuthentication
		, authorizedForCommunity
		, taskValidators.createTask
		, controller.createTaskForCommunityWithSlug
		]);
};


/*
var controller = require('./controller')
	//, model = require('./model')
	, path = require('path')
	//, loginRequired = require(path.join(
	//	'..', '..', 'shared', 'policies', 'login-required')
	//)
	//, communityTransporter = require('./transporter')
	, PREFIX = '/community'
	, SLUG_PREFIX = PREFIX + '/:slug';

/** Function: communityInit
 * Initializes the community component by adding
 * the controller to the available resources.
 *
 * Parameters:
 *   (Express) app - Initialized express application
 *
 * Returns:
 *   (Function) function to initialize relationships after creating all models.
 *
module.exports = function communityInit(app) {

	/**
	 * /community/ GET -- index
	 *				POST -- create
	 *
	 * /community/:slug GET -- get
	 *					PUT -- update
	 *					DEL -- del
	 *
	 * /community/:slug/invite GET -- invite
	 *
	 *
	 * /community/new GET -- fresh (new is protected word)
	 *

	app.all(PREFIX + '*', loginRequired, communityTransporter);

	app.get(PREFIX, controller.index);
	app.post(PREFIX, controller.create);
	app.get(PREFIX + '/new', controller.fresh);

	app.get(SLUG_PREFIX, controller.get);
	app.put(SLUG_PREFIX, controller.update);
	app.get(SLUG_PREFIX + '/invite', controller.invite);

	app.del(SLUG_PREFIX, controller.del);

	return model(app);
};*/