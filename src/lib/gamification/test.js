/* global describe, it, beforeEach */
var EventEmitter = require('../../shared/utils').EventEmitter
	, observer = require('./observer')
	, path = require('path')
	, app = require(path.join(process.cwd(), 'index.js'))()
	, utils = require(path.join(
				process.cwd(), 'src', 'shared', 'utils', 'index.js'));

describe('Gamification', function() {
	describe('Tasks', function() {
		var eventBus, resident, task, Achievement;

		beforeEach(function(done) {
			var db = app.get('db')
				, Resident = db.daoFactoryManager.getDAO('Resident')
				, Community = db.daoFactoryManager.getDAO('Community')
				, Task = db.daoFactoryManager.getDAO('Task');

			eventBus = new EventEmitter();
			observer(eventBus, db);



			Achievement = db.daoFactoryManager.getDAO('Achievement');

			Resident.create({
				name: utils.randomString(12)
				, facebookId: Math.round(1000 * (Math.random() + 1)) *
					Math.round(1000 * (Math.random() + 1))
			}).success(function(createdResident) {
				resident = createdResident;
				var communityName = utils.randomString(12);
				Community.create({
					name: communityName
					, slug: communityName
					, shareLink: communityName
				}).success(function(community) {
					resident.setCommunity(community);

					Task.create({
						name: utils.randomString(12)
						, description: utils.randomString(12)
						, reward: 5
						, dueDate: new Date(new Date() + 24 * 3600)
						, fulfilledAt: new Date(new Date() + 24 * 2900)
					}).success(function(createdTask) {
						task = createdTask;
						task.setCommunity(community);
						task.setFulfillor(resident);
						done();
					});
				});
			}).error(function(err) {
				done(err);
			});

		});

		it('should give an achievement upon first task done', function(done) {
			// due to the asynchronous nature of event-bus, we need to
			// listen to another event.
			// FIXME: Mock EventBus
			eventBus.on('achievement:added', function() {
				resident.getAchievements().success(function(achievements) {
					if(!achievements.length) {
						return done(new Error('No achievements found'));
					}
					done();
				});
			});
			eventBus.trigger('task:done', resident, task);
		});
	});
});