/** Component: Home
 */
var controller = require('./controller');

// inject express-resource into app
require('express-resource');

module.exports = function homeInit(app) {

	app.resource(controller, {
		base: '/'
	});
};