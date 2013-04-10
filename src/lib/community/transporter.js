module.exports = function communityTransporter(req, res, next) {
	var Community = req.app.get('db').daoFactoryManager.getDAO('Community')
		, resident = req.user;

	res.community = undefined;
console.log("da");
	if (!resident || !resident.CommunityId) {
		return next();
	} else {
		Community.find(resident.CommunityId)
			.success( function findResult(community) {
				console.log(community);
				res.locals.community = community;
				return next();
			})
			.error( function createError() {
				return next();
			});
	}
};