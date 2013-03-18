/**
 * Home Controller
 */

module.exports = function(app) {
	app.get('/', index);
	app.get('/login', index);
	app.get('/fbchannel', fbchannel);
}

var index = function(req, res) {
	res.render('index', { title: 'Express' });
};

var fbchannel = function(req, res) {
	res.render('fbchannel', {layout: false});
}