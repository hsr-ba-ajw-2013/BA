var controller = require('./controller');

// inject express-resource into app
require('express-resource');

module.exports = function(app) {

	app.resource('fbchannel', controller);
};