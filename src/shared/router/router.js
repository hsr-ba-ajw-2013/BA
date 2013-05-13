var Barefoot = require('barefoot')()
	, Router = Barefoot.Router
	, MainView = require('../views/main')
	, HomeView = require('../views/home')
	, CreateCommunityView = require('../views/newCommunity')
	, _ = require('underscore');

module.exports = Router.extend({
	routes: {
		'': 'home'
		, 'community': 'community'
	}

	, home: function home() {
		if(!this.isAuthorized()) {
			this.render(this.createView(HomeView));
		} else {
			this.navigate('community', { trigger: true });
		}
	}

	, community: function community() {
		if(this.isAuthorized()) {
			console.log('ok, authorized');
			this.render(this.createView(CreateCommunityView));
		} else {
			console.log('go to login');
			this.navigate('', { trigger: true });
		}
	}


	, isAuthorized: function isAuthorized() {
		var applicationModel = this.dataStore.get('applicationModel')
			, user = applicationModel.get('user')
			, authorized = false;

		if(!_.isUndefined(user)) {
			authorized = !_.isUndefined(user.get('facebookId'));
		}

		return authorized;
	}

	/** Function: createView
	 * Creates an instance of the given view and sets up a reference to the
	 * app-wide event aggregator.
	 *
	 * Paramters:
	 *     (<RoomiesView>) View - The view to create an instance of
	 *
	 * Returns:
	 *     (Object) an instance of the given view.
	 */
	, createView: function createView(View) {
		var view = new View({
			dataStore: this.dataStore
			, apiAdapter: this.apiAdapter
			, eventAggregator: this.eventAggregator
		});

		return view;
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

		if(_.isUndefined(this._mainView)) {
			this._mainView = new MainView({
				locale: locale
				, dataStore: this.dataStore
				, apiAdapter: this.apiAdapter
				, eventAggregator: this.eventAggregator
			});
		} else {
			this._mainView.options.locale = locale;
			this._mainView.options.dataStore = this.dataStore;
			this._mainView.options.apiAdapter = this.apiAdapter;
			this._mainView.options.eventAggregator = this.eventAggregator;
		}

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
		/* jshint camelcase:false */    // Ensures that jshint ignores __super__
		var locale = this.getLocale();
		view.options.locale = locale;

		return this.constructor.__super__.render.call(this, view);
	}
});
