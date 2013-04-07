var express = require('express')
	, path = require('path')
	, hbs = require('express-hbs');

function registerHelpers(app) {
	hbs.registerHelper('stringify', function stringify(item) {
		return new hbs.SafeString(JSON.stringify(item));
	});

	hbs.registerHelper('safestring', function safestring(str) {
		return new hbs.SafeString(str);
	});

	hbs.registerHelper('trans', function trans(str, options) {
		return app.get('__')(str, options);
	});
	hbs.registerHelper('blocktrans', function blocktrans(data, obj) {
		if (!obj) {
			obj = data;
			data = obj.hash;
		}
		return new hbs.SafeString(app.get('__')(obj.fn(this), data));
	});

	hbs.registerHelper('hasProperties', function hasProperties(obj, options) {
		var self = this;
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop)) {
				return options.fn(self);
			}
			return;
		}
		return;
	});
	hbs.registerHelper('navIsActive', function navIsActive(uri, data, options) {
		if(data.requestPath.indexOf(uri) === 0) {
			return options.fn(this);
		}
		return;
	});
}

module.exports = function viewInit(app, config) {
	app.engine('hbs', hbs.express3({
		partialsDir: path.join(config.srcDir, 'shared', 'partials')
		, layoutsDir: path.join(config.srcDir, 'shared', 'layouts')
		, defaultLayout: path.join(
			config.srcDir, 'shared', 'layouts', 'default.hbs')
	}));

	registerHelpers(app);

	app.set('view engine', 'hbs');
	app.set('views', path.join(__dirname, '..'));

	app.use(express.favicon(path.join(
		config.srcDir, 'public', 'images', 'favicon.ico')
		, {
			maxAge: 2592000000 // 30 days
		})
	);
};