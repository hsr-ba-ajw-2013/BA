/** Component: Community
 * The Community component is an Express.JS capable middleware which
 * encapsulates everything related to the Community domain object.
 */
var controller = require('./controller')
	, model = require('./model')
	, path = require('path')
	, loginRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'login-required')
	)
	, PREFIX = '/community'
	, SLUG_PREFIX = PREFIX + '/:slug';

/** Function: communityInit
 * Initializes the community component by adding
 * the controller to the available resources.
 *
 * Uses: express-resource-middleware
 *
 * Parameters:
 *   (express.application) app - Initialized express application
 *
 * Returns:
 *   (Function) function to initialize relationships after creating all models.
 */
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
	 *
	 * /community/:slug/residents GET -> REDIRECT TO residents controller
	 *		/new
	 *		/:id GET/PUT/DELETE
	 */

	app.all(PREFIX + '*', loginRequired);

	app.get(PREFIX, controller.index);
	app.post(PREFIX, controller.create);
	app.get(PREFIX + '/new', controller.fresh);

	app.get(SLUG_PREFIX, controller.get);
	app.put(SLUG_PREFIX, controller.update);
	app.get(SLUG_PREFIX + '/invite', controller.invite);

	app.del(SLUG_PREFIX, controller.del);

	return model(app);
};