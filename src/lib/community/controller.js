/**
 * Community Controller
 */
"use strict";

var PREFIX = '/community'

	, path = require('path')

	, loginRequired = require(path.join('..', '..', 'shared', 'policies', 'login-required'));

module.exports = function(app) {
	app.all(PREFIX + '*', loginRequired);
	app.get(PREFIX, index);
	//app.get(PREFIX + '/:id', showCommunity);
	app.get(PREFIX + '/create', create);
	app.post(PREFIX + '/create', createPost);
}

var index = function(req, res) {
	var resident = req.user
		, Resident = req.app.get('db').daoFactoryManager.getDAO('Resident')
		, Community = req.app.get('db').daoFactoryManager.getDAO('Community');

	resident.getCommunity().success(function(community) {
		if (!community) {
			return res.redirect('./create');
		}
		return renderIndex(req, res, community);
	}).error(function(err) {
		return res.redirect('./create');
	});

};

var renderIndex = function(req, res, community) {
	res.render('community/views/index', { title: res.__('Your community %s', community.name) });
};

var create = function(req, res) {
	res.render('community/views/create', { title: res.__('Create Community'), flash: req.flash()});
};

var createPost = function(req, res) {
	var resident = req.user
		, Resident = req.app.get('db').daoFactoryManager.getDAO('Resident')
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
					}).error(function(errors) {
						console.log("errors: ", errors);
					});
			}
		});
};


/* * * * * * P R I V A T E * * * * * * * */

