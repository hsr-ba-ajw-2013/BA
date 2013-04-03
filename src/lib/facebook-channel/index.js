var controller = require('./controller');


module.exports = function facebookChannelInit(app) {

	app.get('/fbchannel', controller.index);
};