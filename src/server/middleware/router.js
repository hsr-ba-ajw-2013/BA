/** Module: Router
 * Express router
 */

/** Function: routerInit
 * Initializes the express router.
 *
 * Parameters:
 *   (Express) app - Initialized express application
 */
module.exports = function routerInit(app) {
	app.use(app.router);
};