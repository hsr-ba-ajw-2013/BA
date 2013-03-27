/**
 * Home Controller
 */

exports.index = function index(req, res) {
	res.render('facebook-channel/views/index', {layout: false});
};

