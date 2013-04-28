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
		this.render(new HomeView());
	}

	, mainView: function() {
		if(_.isUndefined(this._mainView)) {
			this._mainView = new MainView();
		}
		return this._mainView;
	}
});