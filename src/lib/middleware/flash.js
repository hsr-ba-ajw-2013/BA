var flash = require('connect-flash')
	, util = require('util');

module.exports = function(app) {
	app.use(flash());

	app.use(function(req, res, next) {
		app.locals.messages = req.flash();

		next();
	});
};