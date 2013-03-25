/**
 * Home Controller
 */

exports.index = function(req, res) {
	res.render('facebook-channel/views/index', {layout: false});
};

