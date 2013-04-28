var Barefoot = require('barefoot')()
	, Router = Barefoot.Router;

module.exports = Router.extend({
	routes: {
		'': 'home'
	}

	, home: function home() {
		console.log('home');
	}
});