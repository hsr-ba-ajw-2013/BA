var controller = require('./controller');

// inject express-resource-middleware into app
require('express-resource-middleware');

module.exports = function facebookChannelInit(app) {

	app.resource('fbchannel', controller);
};