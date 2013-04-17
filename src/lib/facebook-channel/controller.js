/** Controller: FacebookChannel.Controller
 * Facebook Channel
 */

/** Function: index
 * Renders the facebook channel script without any layout assigned to it.
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 */
exports.index = function index(req, res) {
	res.render('facebook-channel/views/index', {layout: false});
};

