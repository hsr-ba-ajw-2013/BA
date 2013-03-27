module.exports = function clientConfigInit(app, config) {
	app.locals.config = {
		facebook: {
			clientID: config.facebook.clientID
			, channelUrl: config.facebook.channelUrl
			, checkStatus: config.facebook.checkStatus
			, useCookies: config.facebook.useCookies
			, parseXfbml: config.facebook.parseXfbml
		}
	};
};