/** Component: Rank
 * The Rank component is an Express.JS capable middleware which
 * encapsulates everything related to the Rank domain object.
 */
var controller = require('./controller')
	//, model = require('./model')
	, path = require('path')
	, loginRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'login-required')
	)
	, communityRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'community-required')
	)
	, COMMUNITY_PREFIX = '/community/:slug'
	, RANK_PREFIX = COMMUNITY_PREFIX + '/rank';

/** Function: rankInit
 * Initializes Rank URLs
 *
 * Parameters:
 *   (Express) app - Initialized express application
 *
 * Returns:
 *   (Function) function to initialize relationships after creating all models.
 */
module.exports = function rankInit(app) {
	/**
	 * /community/:slug/rank GET -- index
	 */

	app.all(RANK_PREFIX, loginRequired, communityRequired);

	app.get(RANK_PREFIX, controller.index);
};