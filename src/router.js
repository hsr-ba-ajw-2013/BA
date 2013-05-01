var Barefoot = require('barefoot')()
	, Router = Barefoot.Router
	, MainView = require('./mainView')
	, HomeView = require('./homeView')
	, _ = require('underscore');

module.exports = Router.extend({
	routes: {
		'': 'home'
	}

	, home: function home() {
		var locale = this.cookieAdapter.get('locale');
		this.render(new HomeView({ locale: locale }));
	}

	, mainView: function() {
		var locale = this.cookieAdapter.get('locale');

		if(_.isUndefined(this._mainView)) {
			this._mainView = new MainView();
		}

		this._mainView.options.locale = locale;
		return this._mainView;
	}
});