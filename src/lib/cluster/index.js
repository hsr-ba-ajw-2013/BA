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

	// FIXME: Because the session is stored currently in memory,
	//        clustering is no good as every cluster has it's
	//        own memory space.
	var initFunction = init;

	if(cluster.isMaster) {
		initFunction = initMaster;
	} else {
		initFunction = init;
	}

	return initFunction();
};

