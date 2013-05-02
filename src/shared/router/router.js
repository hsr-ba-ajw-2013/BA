var Barefoot = require('barefoot')()
	, Router = Barefoot.Router
	, MainView = require('../views/main')
	, HomeView = require('../views/home')
	, _ = require('underscore');

module.exports = Router.extend({
	routes: {
		'': 'home'
	}

	, home: function home() {
		this.render(new HomeView());
	}

	/** Function: getLocale
	 * Reads the locale cookie from the CookieAdapter and returns its value.
	 *
	 * Returns:
	 *     (String)
	 */
	, getLocale: function getLocale() {
		return this.cookieAdapter.get('locale');
	}

	/** Function: mainView
	 * Supplies a singleton instance of <MainView>. The underlying
	 * implemenation of Barefoot will ensure that the instance is cloned
	 * when rendering the view on the server.
	 *
	 * Returns:
	 *     (<MainView>)
	 */
	, mainView: function mainView() {
		var locale = this.getLocale();

		if(_.isUndefined(this._mainView)) { this._mainView = new MainView(); }
		this._mainView.options.locale = locale;

		return this._mainView;
	}

	/** Function: render
	 * Ensures that the locale, present in the <CookieAdapter>, is injected
	 * into any view which wil be rendered by this router.
	 *
	 * The implementation of Barefoots router is preserved by calling supers
	 * implementation of render.
	 *
	 * Parameters:
	 *     (<RoomiesView>) view - The view which should be rendered.
	 */
	, render: function render(view) {
		/* jshint camelcase:false */ // Ensures that jshint ignores __super__
		var locale = this.getLocale();
		view.options.locale = locale;

		return this.constructor.__super__.render.call(this, view);
	}
});