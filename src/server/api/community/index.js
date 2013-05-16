/** Component: Community
 * The Community component is an Express.JS capable middleware which
 * encapsulates everything related to the Community domain object.
 */

var controller = require('./controller')
	, path = require('path')
	, utils = require('../utils')
	, modulePrefix = '/community';

module.exports = function initCommunityApi(api, apiPrefix) {
	var prefix = path.join(apiPrefix, modulePrefix);

	api.get(path.join(prefix, ':slug'), controller.getCommunityWithSlug);
	api.post(prefix, controller.createCommunity);

	api.app.post(modulePrefix, utils.buildFormRoute(
		'success', 'error', controller.createCommunity, api));
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