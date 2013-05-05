var _ = require('underscore')
	, templateLocales = require('../../shared/locales')
	, locale = require('locale')(templateLocales.supported);

	
function ensureLocale(req, res, next) {
	if(_.isUndefined(req.cookies)) {
		req.cookies = { locale: req.locale };
	} else {
		if(_.has(req.cookies, 'locale')) {
			req.cookies = { locale: req.locale };
		} else {
			req.cookies = _.extend(req.cookies, { locale: req.locale });
		}
	}

	next();
}

function putLocaleToRequest(req, res, next) {
	res.cookie('locale', req.locale);
	next();
}

function setupLocale(app) {
	app.use(locale);

	app.use(ensureLocale);
	app.use(putLocaleToRequest);
}

module.exports = setupLocale;