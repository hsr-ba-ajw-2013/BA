/**
 * Community Controller
 */
"use strict";

var PREFIX = '/community'

	, path = require('path')

	, loginRequired = require(path.join('..', '..', 'shared', 'policies', 'login-required'));

module.exports = function(app) {
	app.all(PREFIX + '*', loginRequired);
	app.get(PREFIX + '/', index);
	app.get(PREFIX + '/create', create);
}

var index = function(req, res) {
	var resident = req.user
		, Resident = req.app.get('db').daoFactoryManager.getDAO('Resident')
		, Community = req.app.get('db').daoFactoryManager.getDAO('Community');
	console.log(resident);

	resident.getCommunity().success(function(community) {
		if (!community) {
			return res.redirect('/community/create');
		}
	}).error(function(err) {
		return res.redirect('/community/create');
	});

};

var create = function(req, res) {
	res.send(200);
}