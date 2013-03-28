/** Component: Login
 */
var controller = require('./controller');

// inject express-resource-middleware into app
require('express-resource-middleware');


module.exports = function loginInit(app) {
	app.resource('login', controller);
};