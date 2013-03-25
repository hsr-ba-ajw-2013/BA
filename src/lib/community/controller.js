/**
 * Community Controller
 */

var renderIndex = function(req, res, community) {
	res.render('community/views/index', {
		title: res.__('Your community %s', community.name)
	});
};

exports.index = function(req, res) {
	var resident = req.user;

	resident.getCommunity().success(function(community) {
		if (!community) {
			return res.redirect('./new');
		}
		return renderIndex(req, res, community);
	}).error(function() {
		return res.redirect('./new');
	});

};

exports.new = function(req, res) {
	res.render('community/views/create', {
		title: res.__('Create Community'),
		flash: req.flash()
	});
};

exports.create = function(req, res) {
	var resident = req.user
		, Community = req.app.get('db').daoFactoryManager.getDAO('Community');

	//TODO: validate POST

	var communityData = {
			name: req.body.cname
	};

	console.log(communityData);

	Community.find({ where: communityData })
		.success(function(community) {
			if (community !== null) {
				req.flash('error', "OH NO!!!");
				res.redirect('back');
			} else {
				Community.create(communityData)
					.success(function(community) {
						console.log("community created: ", community);
						console.log("---: ", resident);

						resident.setCommunity(community)
							.success(function(result) {
								console.log(result);
								console.log("community has resident");
								res.redirect('./');
							});

					}).error(function(errors) {
						console.log("errors: ", errors);
					});
			}
		});
};