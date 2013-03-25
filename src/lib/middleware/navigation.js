module.exports = function(app) {

	app.use(function(req, res, next) {
		var navigation = [];

		if (req.user) {
			navigation.push({
				url: '/task'
				, icon: 'list'
				, title: res.__('Tasks')
			});
			navigation.push({
				url: '/rank'
				, icon: 'trophy'
				, title: res.__('Rank')
			});
			navigation.push({
				url: '/invite'
				, icon: 'share'
				, title: res.__('Invite')
			});
		}

		app.locals.navigation = navigation;
		next();
	});
};