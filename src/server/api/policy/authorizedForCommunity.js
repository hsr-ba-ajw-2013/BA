/** Policy: AuthorizedForCommunity
 * Stack this policy on any route which contains a community slug as first
 * named url parameter to check, if the current user is authorized to access
 * data of the regarding community.
 */

var _ = require('underscore')
	, errors = require('../errors');

/** Function: authorizedForCommunity
 * Checks if the current session user is member of the community with the given
 * community slug.
 *
 * If the user is member, success is called so the processing of the request can
 * proceed. If not, a <NotAuthorizedError> is passed by calling the error
 * callback function.
 *
 * Parameters:
 *     (Function) success - Success callback
 *     (Function) error - Error callback
 *     (String) slugOrId - Slug or ID of a community
 */
function authorizedForCommunity(success, error, slugOrId) {
	var user = this.req.user
		, unauthorized = function() {
			error(new errors.NotAuthorizedError('Not Authorized!'));
		}
		, check = function(community, slugOrId) {
			var ok = false
				, isId = !_.isNull(slugOrId.match(/^\d*$/));

			if(isId) {
				var id = parseInt(slugOrId, 10);
				ok = (community.id === id);
			} else {
				ok = (community.slug === slugOrId);
			}

			return ok;
		};

	if(!_.isUndefined(user) && _.isFunction(user.getCommunity)) {
		user.getCommunity()
			.success(function ok(community) {
				if(!_.isNull(community) && check(community, slugOrId)) {
					success();
				} else {
					unauthorized();
				}
			})
			.error(function nok() {
				unauthorized();
			});
	} else {
		unauthorized();
	}
}

module.exports = authorizedForCommunity;