/**
 * API endpoints
 */

module.exports = function(schema) {
	var resource = require('express-resource'),
		resourceJuggling = require('resourceJuggling'),
		app = express();

	app.resource('community', resourceJuggling.getResource({
		schema: schema
		, name: 'Community'
		, model: schema.models.Community
		, base: '/api/'
	}));
	app.resource('task', resourceJuggling.getResource({
		schema: schema
		, name: 'Task'
		, model: schema.models.Task
		, base: '/api/'
	}));
	app.resource('user', resourceJuggling.getResource({
		schema: schema
		, name: 'User'
		, model: schema.models.User
		, base: '/api/'
	}));

	return app;
}