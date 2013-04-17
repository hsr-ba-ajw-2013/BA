/** Module: TemplateData
 * Assigns template data to the templates.
 */

/** Function: templateDataInit
 * Initializes the template data middleware.
 */
module.exports = function templateDataInit(app) {

	app.use(function assignRequestPath(req, res, next) {
		res.locals.requestPath = req.path;
		next();
	});

	app.use(function assignUrlData(req, res, next) {
		res.locals.protocol = req.protocol;
		res.locals.host = req.headers.host;
		next();
	});
};