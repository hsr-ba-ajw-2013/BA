/**
 * Home Controller
 */
"use strict";

module.exports = function(app) {
	app.get('/', index);
	app.get('/login', index);
	app.get('/fbchannel', fbchannel);
}

var index = function(req, res) {
	console.log("homectrl", req.user, res.locals.user);
	res.render('home/views/index', { title: 'Express' });
};

var fbchannel = function(req, res) {
	res.render('home/views/fbchannel', {layout: false});
}