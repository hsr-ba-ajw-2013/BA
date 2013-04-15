/** Component: Cluster
 *
 * Original Source:
 *   - https://github.com/hunterloftis
 */

var cluster = require('cluster')
	, os = require('os');

function initMaster() {
	cluster.on('exit', function() {
		cluster.fork();
	});

	var workerCount = os.cpus().length;
	while(workerCount--) {
		cluster.fork();
	}
}

module.exports = function balance(init) {
	var initFunction = init
		// detect if in debug mode - don't launch a cluster then
		, debug = typeof v8debug === 'object';

	if(cluster.isMaster && !debug) {
		initFunction = initMaster;
	} else {
		initFunction = init;
	}

	return initFunction();
};

