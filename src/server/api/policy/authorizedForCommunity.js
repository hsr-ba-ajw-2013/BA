/** Policy: AuthorizedForCommunity
 * Stack this policy on any route which contains a community slug as first
 * named url parameter to check, if the current user is authorized to access
 * data of the regarding community.
 */

var _ = require('underscore')
	, debug = require('debug')('roomies:api:policy:authorized-for-community')
	, errors = require('../errors');

/** Function: authorizedForCommunity
 * Checks if the current session user is member of the community with the given
 * community slug.
 *
 * If the user is a member, the community database object is stored in the
 * current request object and success is called so the processing of the
 * request can proceed. If not, a <NotAuthorizedError> is passed by calling the
 * error callback function.
 *
 * Parameters:
 *     (Function) success - Success callback
 *     (Function) error - Error callback
 *     (String) slugOrId - Slug or ID of a community
 */
function authorizedForCommunity(success, error, slugOrId) {
	debug('authorized for community check');
	var self = this
		, user = self.req.user
		, unauthorized = function() {
			debug('...error');
			error(new errors.NotAuthorizedError('Not Authorized!'));
		}
		, check = function(community, slugOrId) {
			var ok = false
				, isId = !_.isNull((''+slugOrId).match(/^\d*$/));

			if(isId) {
				var id = parseInt(slugOrId, 10);
				ok = (community.id === id);
			} else {
				ok = (community.slug === slugOrId);
			}

			debug('..ok? %s', ok);
			return ok;
		};

	if(!_.isUndefined(user) && _.isFunction(user.getCommunity)) {
		user.getCommunity({where: { enabled: true }})
			.success(function ok(community) {
				if(!_.isNull(community) && check(community, slugOrId)) {
					self.req.community = community;
					debug('...ok');
					success();
				} else {
					console.log("1", self.req.community);
					delete self.req.community;
					console.log("2", self.req.community);
					unauthorized();
				}
			})
			.error(function nok() {
				console.log("3", self.req.community);
				delete self.req.community;
				console.log("4", self.req.community);
				unauthorized();
			});
	} else {
		console.log("4", self.req.community);
		delete self.req.community;
		console.log("6", self.req.community);
		unauthorized();
	}
}

module.exports = authorizedForCommunity;