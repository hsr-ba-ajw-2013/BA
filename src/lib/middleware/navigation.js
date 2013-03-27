module.exports = function navigationInit(app) {

	app.use(function assignRequestPath(req, res, next) {
		res.locals.requestPath = req.path;
		next();
	});
};