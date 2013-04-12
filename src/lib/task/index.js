/** Component: Task
 */
var controller = require('./controller')
	, model = require('./model')
	, path = require('path')
	, loginRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'login-required')
	)
	, COMMUNITY_PREFIX = '/community/:slug'
	, TASK_PREFIX = COMMUNITY_PREFIX + '/task';

module.exports = function taskInit(app) {
	/**
	 * /community/:slug/tasks GET/POST
	 *		/new
	 *		/:id GET/PUT/DELETE
	 */

	app.all(TASK_PREFIX, loginRequired);

	app.get(TASK_PREFIX, controller.index);
	app.post(TASK_PREFIX, controller.create);

	app.get(TASK_PREFIX + '/new', controller.fresh);

	app.get(TASK_PREFIX + '/:id', controller.get);
	app.put(TASK_PREFIX + '/:id', controller.update);
	app.del(TASK_PREFIX + '/:id', controller.del);


	return model(app);
};