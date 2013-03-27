var flash = require('connect-flash');

module.exports = function flashInit(app) {
	app.use(flash());

	app.use(function(req, res, next) {
		app.locals.messages = req.flash();

		next();
	});
};