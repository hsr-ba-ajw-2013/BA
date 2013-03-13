/**
 * Home Controller
 */


exports.index = function(req, res) {
	res.render('index', { title: 'Express' });
};