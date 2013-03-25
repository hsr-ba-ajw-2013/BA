"use strict";

var i18n = require('i18n'),
	path = require('path');

module.exports = function(app, config) {

	i18n.configure({
		locales:['en', 'de']
		, directory: path.join(config.srcDir, 'shared', 'locales')
	});
	app.use(i18n.init);

	app.set('__', i18n.__);

	// binding template helpers to request.
	// Credits to https://github.com/enyo #12
	app.use(function(req, res, next) {
		res.locals.__ = res.__ = function() {
			return i18n.__.apply(req, arguments);
		};
		res.locals.__n = res.__n = function() {
			return i18n.__n.apply(req, arguments);
		};
		// do not forget this, otherwise your app will hang
		next();
	});
};