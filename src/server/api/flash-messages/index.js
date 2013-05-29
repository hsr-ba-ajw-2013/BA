/** Component: Api.FlashMessages
 * The FlashMessages API component sets up the APIAdapter to send flash messages
 * to the client.
 *
 * API Routes:
 *     GET flash-messages - Returns the flash messages
 */

var controller = require('./controller')
	, modulePrefix = '/flash-messages';

module.exports = function initCommunityApi(api, apiPrefix) {
	var prefix = apiPrefix + modulePrefix;

	// GET /api/community/:id
	api.get(prefix, controller.getFlashMessages);

	controller.setupObservers(api.app);
};