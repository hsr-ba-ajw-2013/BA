/**
 * Author: https://github.com/hunterloftis
 * URL: https://github.com/hunterloftis/component-test/blob/master/lib/balance/index.js
 */
"use strict";

var cluster = require('cluster')
	, os = require('os');

module.exports = function balance(init) {
	return cluster.isMaster? initMaster() : init();
};

function initMaster() {
	cluster.on('death', function(worker) {
		cluster.fork();
	});

	var workerCount = os.cpus().length;
	while(workerCount--) {
		cluster.fork();
	}
}