/** Component: Home
 */
var controller = require('./controller');

// inject express-resource-middleware into app
require('express-resource-middleware');


module.exports = function homeInit(app) {
	app.resource(controller, {
		base: '/'
	});
};