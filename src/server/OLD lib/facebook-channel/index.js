/** Component: FacebookChannel
 * The Facebook-Channel component is an Express.JS capable middleware which
 * encapsulates everything related to Facebook for frontend.
 */

var controller = require('./controller');

/** Function: facebookChannelInit
 * Initializes facebook channel URL /fbchannel.
 *
 * Parameters:
 *   (express.application) app - Initialized express application
 */
module.exports = function facebookChannelInit(app) {

	app.get('/fbchannel', controller.index);
};