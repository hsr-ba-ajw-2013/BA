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
	, communityRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'community-required')
	)
	, communityIsActive = require(path.join(
		'..', '..', 'shared', 'policies', 'community-isactive')
	)
	, communityTransporter = require('./transporter')
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
	 */

	app.all(PREFIX + '*', loginRequired, communityTransporter);

	app.get(PREFIX, communityRequired, communityIsActive, controller.index);
	app.post(PREFIX, controller.create);
	app.del(PREFIX, controller.del);
	app.get(PREFIX + '/new', controller.fresh);

	app.all(SLUG_PREFIX, communityRequired, communityIsActive);

	app.get(SLUG_PREFIX, controller.get);
	app.put(SLUG_PREFIX, controller.update);
	app.get(SLUG_PREFIX + '/invite', controller.invite);

	app.del(SLUG_PREFIX, controller.del);

	return model(app);
};