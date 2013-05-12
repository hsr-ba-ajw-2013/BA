/* global describe, it, beforeEach */
var	path = require('path')
	, srcPath = path.join(process.cwd(),
		(process.env.COVERAGE ? 'src-cov' : 'src'))
	, EventEmitter = require(path.join(srcPath, 'shared', 'utils')).EventEmitter
	, observer = require(path.join(srcPath, 'lib', 'gamification', 'observer'))
	, app = require(path.join(process.cwd(), 'index.js'))()
	, utils = require(path.join(
				srcPath, 'shared', 'utils', 'index.js'))
	, uslug = require('uslug')
	, Task = app.get('db').daoFactoryManager.getDAO('Task');

function giveFulfilledTask(eventBus, resident, amount) {
	if (amount === 0) {
		return;
	}
	Task.create({
		name: utils.randomString(12)
		, description: utils.randomString(12)
		, reward: 2
		, dueDate: new Date(new Date() + 24 * 3600)
		, fulfilledAt: new Date(new Date() + 24 * 2800)
		, CommunityId: resident.CommunityId
	}).success(function(createdTask) {
		createdTask.setFulfillor(resident).success(function() {
			eventBus.trigger('task:done', resident, createdTask);
			giveFulfilledTask(eventBus, resident, --amount);
		});
	});
}

describe('Gamification', function() {
	describe('Tasks', function() {
		var eventBus, resident, task, Achievement
			, user = {
				name: utils.randomString(12)
				, facebookId: Math.round(1000 * (Math.random() + 1)) *
					Math.round(1000 * (Math.random() + 1))
			}
			, communityName = utils.randomString(12)
			, communitySlug = uslug(communityName);

		before(function(done) {
			var db = app.get('db')
				, Resident = db.daoFactoryManager.getDAO('Resident')
				, Community = db.daoFactoryManager.getDAO('Community');

			eventBus = new EventEmitter();
			observer(eventBus, db);

			Achievement = db.daoFactoryManager.getDAO('Achievement');

			Resident.create(user).success(
				function residentCreated(createdResident) {
					resident = createdResident;
					Community.create({
						name: communityName
						, slug: communitySlug
						, shareLink: communityName
					}).success(function(community) {
						resident.setCommunity(community);

						Task.create({
							name: utils.randomString(12)
							, description: utils.randomString(12)
							, reward: 5
							, dueDate: new Date(new Date() + 24 * 3600)
						}).success(function(createdTask) {
							task = createdTask;
							task.setCommunity(community)
								.success(function communitySet() {
									task = createdTask;
									done();
								});
						});
					});
			}).error(function(err) {
				done(err);
			});

		});

		it('should give an achievement upon first task done', function(done) {
			// due to the asynchronous nature of event-bus, we need to
			// listen to another event.
			task.fulfilledAt = new Date(new Date() + 24 * 2900);
			task.save().success(function saved() {
				task.setFulfillor(resident).success(function fulfillorSet() {
					eventBus.on('achievement:added', function() {
						eventBus.removeAllListeners('achievement:added');
						resident.getAchievements()
							.success(function(achievements) {
								if(!achievements.length) {
									return done(
										new Error('No achievements found'));
								}
								done();
							});
					});
					eventBus.trigger('task:done', resident, task);
				});
			});
		});

		it('should give an achievement after ten tasks done', function(done) {
			// due to the asynchronous nature of event-bus, we need to
			// listen to another event.
			eventBus.on('achievement:added', function() {
				resident.getAchievements({type: 'ten-tasks'})
					.success(function(achievements) {
						if(!achievements.length) {
							return done(
								new Error('No achievements found'));
						}
						done();
					});
			});
			giveFulfilledTask(eventBus, resident, 9);
		});
	});
});