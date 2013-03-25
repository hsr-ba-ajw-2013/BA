/* global FB, document */

module.exports = (function(config, window) {
	window.fbAsyncInit = function() {
		// init the FB JS SDK
		FB.init({
			appId        : config.clientID
			, channelUrl : config.channelURL
			, status     : config.checkStatus
			, cookie     : config.useCookies
			, xfbml      : config.parseXfbml
		});

		// Additional initialization code such as adding Event Listeners
		// goes here
	};

	// Load the SDK's source Asynchronously
	// Note that the debug version is being actively developed and might
	// contain some type checks that are overly strict.
	// Please report such bugs using the bugs tool.
	(function(d, debug){
		var js
			, id = 'facebook-jssdk'
			, ref = d.getElementsByTagName('script')[0];

		if(d.getElementById(id)) {
			return;
		}

		js = d.createElement('script'); js.id = id; js.async = true;

		var facebookUrl = "//connect.facebook.net/en_US/all";
		if(debug) {
			facebookUrl += "/debug";
		}
		facebookUrl += ".js";
		js.src = facebookUrl;

		ref.parentNode.insertBefore(js, ref);
	}(document, /*debug*/ false));
});