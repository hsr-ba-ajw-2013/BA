"use strict";

var Roomies = (function(self) {
	var $ = require('./lib/jquery-1.9.1'),
		Backbone = require('./lib/backbone'),
		facebook = require('./facebook');

	self.init = function(config, window) {

		facebook(config.facebook, window);
	}

	return self;
})(Roomies || {});
window.Roomies = Roomies;