/** Class: Api.Community.Errors
 *
 */
var Barefoot = require('barefoot')()
	, errors = Barefoot.errors
	, ResidentAlreadyInCommunityError = errors.createError(409
										, 'ResidentAlreadyInCommunityError')
	, CommunityAlreadyExistsError = errors.createError(409
										, 'CommunityAlreadyExistsError');

module.exports = {
	ResidentAlreadyInCommunityError: ResidentAlreadyInCommunityError
	, CommunityAlreadyExistsError: CommunityAlreadyExistsError
};