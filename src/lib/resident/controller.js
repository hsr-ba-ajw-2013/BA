/** Controller: Resident.Controller
 * Resident Controller
 */

/** Function: fresh
 *
 * Parameters:
 *   (express.request) req - Request
 *   (express.response) res - Response
 */
exports.fresh = function(req, res) {
	var shareLink = req.cookies.shareLink;
	shareLink = shareLink;
	res.clearCookie('shareLink');



	res.send(200);
};

