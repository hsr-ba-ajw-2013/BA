/** Component: Cluster
 * If the host's cpu has multiple cores and the app is not started in
 * debug mode, it will spawn as many node processes as cpu cores.
 *
 * See also:
 *   <Cluster API Docs at http://nodejs.org/api/cluster.html>
 *
 * Original Source:
 *   - <Express app components test at
 *        https://github.com/hunterloftis/component-test>
 */

var cluster = require('cluster')
	, os = require('os');

/** PrivateFunction: initMaster
 * Forks as many workers as available cpu cores.
 *
 * If a worker dies, a new fork is spawned.
 */
function initMaster() {
	cluster.on('exit', function() {
		cluster.fork();
	});

	var workerCount = os.cpus().length;
	while(workerCount--) {
		cluster.fork();
	}
}

/** Function: balance
 * Start workers if needed using the init function passed as an argument.
 *
 * Parameters:
 *   (Function) init - Function to start the application
 *
 * Returns:
 *   (Function) - Init function to call.
 */
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

