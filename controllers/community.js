/**
 * Community Controller
 */

var prefix = '/community';

module.exports = function(app) {
	app.get(prefix + '/', index);
}

var index = function(req, res) {
	res.send(200);
};