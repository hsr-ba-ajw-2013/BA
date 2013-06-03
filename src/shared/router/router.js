var Barefoot = require('node-barefoot')()
	, Router = Barefoot.Router
	, MainView = require('../views/main')
	, HomeView = require('../views/home')
	, CreateCommunityView = require('../views/community/create')
	, InviteCommunityView = require('../views/community/invite')
	, JoinCommunityView = require('../views/community/join')
	, ListTasksView = require('../views/task/list')
	, TaskFormView = require('../views/task/form')
	, ListRankingView = require('../views/ranking/list')
	, NotFoundView = require('../views/error/not-found')
	, Profile = require('../views/resident/profile')
	, _ = require('underscore');

module.exports = Router.extend({
	routes: {
		'': 'home'
		, 'community': 'createCommunity'
		, 'community/create': 'createCommunity'

		, 'community/:communitySlug/invite': 'inviteCommunity'
		, 'join/:shareLink': 'joinCommunity'

		, 'community/:communitySlug/tasks': 'listTasks'

		, 'community/:communitySlug/tasks/new': 'createTask'
		, 'community/:communitySlug/tasks/:taskId/edit': 'editTask'

		, 'community/:communitySlug/rankings': 'listRanking'

		, 'resident/:facebookId/profile': 'profile'

		, 'logout': 'logout'

		, '*path': 'notFound'
	}

	, home: function home() {
		if(!this.isAuthorized()) {
			this.render(this.createView(HomeView));
		} else {
			var community = this.dataStore.get('community');
			if(!community) {
				this.navigate('community/create', { trigger: true });
			} else {
				this.navigate('community/' + community.get('slug') +
					'/tasks', { trigger: true });
			}
		}
	}

	, createCommunity: function createCommunity() {
		if(!this.redirectIfNotAuthorized()) {
			this.render(this.createView(CreateCommunityView));
		}
	}

	, inviteCommunity: function inviteCommunity() {
		if(!this.redirectIfNotAuthorized() &&
			!this.redirectIfInValidCommunity()) {
			this.render(this.createView(InviteCommunityView));
		}
	}

	, joinCommunity: function joinCommunity(shareLink) {
		if(!this.redirectIfNotAuthorized()) {
			var CommunityModel = require('../models/community')
				, community = new CommunityModel();
			community.url = '/api/join/community/' + shareLink;
			this.dataStore.set('community', community);
			this.render(this.createView(JoinCommunityView));
		}
	}

	, listTasks: function listTasks(communitySlug) {
		if(!this.redirectIfNotAuthorized() &&
			!this.redirectIfInValidCommunity()) {
			var tasks = this.dataStore.get('tasks')
				, url = '/api/community/' + communitySlug + '/tasks';

			if(tasks) {
				tasks.url = url;
			} else {
				var TasksCollection = require('../collections/tasks');
				tasks = new TasksCollection();
				tasks.url = url;
				this.dataStore.set('tasks', tasks);
				tasks.fetch();
			}
			var listTasksView = this.createView(ListTasksView);
			this.render(listTasksView);
		}
	}

	, createTask: function createTask() {
		if(!this.redirectIfNotAuthorized() &&
			!this.redirectIfInValidCommunity()) {
			this.render(this.createView(TaskFormView));
		}
	}

	, editTask: function editTask(communitySlug, taskId) {
		if(!this.redirectIfNotAuthorized() &&
			!this.redirectIfInValidCommunity()) {

			var TaskModel = require('../models/task')
				, task = new TaskModel();

			task.url = '/api/community/' + communitySlug + '/tasks/' + taskId;

			this.dataStore.set('task', task);

			if (!this.redirectIfTaskNotEditable()) {
				this.render(this.createView(TaskFormView));
			}
		}
	}

	, listRanking: function listRanking(communitySlug) {
		if(!this.redirectIfNotAuthorized() &&
			!this.redirectIfInValidCommunity()) {
			var RankingCollection = require('../collections/rankings')
				, rankings = new RankingCollection();
			rankings.url = '/api/community/' + communitySlug + '/rankings';
			this.dataStore.set('rankings', rankings);

			this.render(this.createView(ListRankingView));
		}
	}

	, profile: function profile(facebookId) {
		if(!this.redirectIfNotAuthorized() &&
			!this.redirectIfInValidCommunity()) {
			var ResidentProfileModel = require('../models/residentprofile')
				, residentProfile = new ResidentProfileModel();

			residentProfile.url = '/api/resident/' + facebookId + '/profile';
			this.dataStore.set('residentProfile', residentProfile);

			var profileView = this.createView(Profile);
			this.render(profileView);
		}
	}

	, notFound: function notFound() {
		this.render(this.createView(NotFoundView));
	}

	, logout: function logout() {
		this.navigate('/logout', {trigger: true});
		/* global window */
		window.location.reload();
	}


	, isAuthorized: function isAuthorized() {
		var currentUser = this.dataStore.get('currentUser')
			, authorized = false;

		if(!_.isUndefined(currentUser)) {
			authorized = !_.isUndefined(currentUser.get('facebookId'));
		}

		return authorized;
	}

	/** Function: redirectIfNotAuthorized
	 * If the client is not authorized it will redirect. Otherwise it returns
	 * false to indicate that the calling method can continue work.
	 */
	, redirectIfNotAuthorized: function redirectIfNotAuthorized() {
		if(!this.isAuthorized()) {
			// FIXME: client/server independant?
			var req = this.apiAdapter.req;
			req.session.redirectUrl = req.originalUrl;
			this.navigate('', {trigger: true});
			return true;
		}
		return false;
	}

	/** Function: redirectIfInvalidCommunity
	 * If the client is not in a community or not in an enabled community
	 * it will redirect. Otherwise it returns false to indicate that the
	 * calling method can continue work.
	 */
	, redirectIfInValidCommunity: function redirectIfInValidCommunity() {
		var community = this.dataStore.get('community');
		if(!community) {
			this.navigate('/community/create', {trigger: true});
			return true;
		}
		return false;
	}

	/** Function: redirectIfTaskNotEditable
	 * If the client is not in a community or not in an enabled community
	 * it will redirect. Otherwise it returns false to indicate that the
	 * calling method can continue work.
	 */
	, redirectIfTaskNotEditable: function redirectIfTaskNotEditable() {
		var task = this.dataStore.get('task')
			, community = this.dataStore.get('community');
		if(!task || task.isFulfilled) {
			this.navigate('/community/' +
				community.slug + '/tasks', {trigger: true});
			return true;
		}
		return false;
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
			, router: this
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
				, router: this
			});
		} else {
			this._mainView.options.locale = locale;
			this._mainView.options.dataStore = this.dataStore;
			this._mainView.options.apiAdapter = this.apiAdapter;
			this._mainView.options.eventAggregator = this.eventAggregator;
			this._mainView.options.router = this;
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

		this.trigger('render');

		/* jshint camelcase:false */    // Ensures that jshint ignores __super__
		var locale = this.getLocale();
		view.options.locale = locale;

		return this.constructor.__super__.render.call(this, view);
	}
});
