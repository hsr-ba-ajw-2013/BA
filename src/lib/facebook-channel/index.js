var controller = require('./controller');

// inject express-resource into app
require('express-resource');

module.exports = function facebookChannelInit(app) {

	app.resource('fbchannel', controller);
};