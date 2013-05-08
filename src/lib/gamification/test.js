/* global describe, it, beforeEach */
var	path = require('path')
	, srcPath = path.join(process.cwd(), (process.env.COVERAGE ? 'src-cov' : 'src'))
	, request = require('super-request')
	, EventEmitter = require(path.join(srcPath, 'shared', 'utils')).EventEmitter
	, observer = require(path.join(srcPath, 'lib', 'gamification', 'observer'))
	, app = require(path.join(process.cwd(), 'index.js'))()
	, utils = require(path.join(
				srcPath, 'shared', 'utils', 'index.js'))
	, uslug = require('uslug');

describe('Gamification', function() {
	describe('Tasks', function() {
		var eventBus, resident, task, Achievement
			, req = request(app)
			, user = {
				name: utils.randomString(12)
				, facebookId: Math.round(1000 * (Math.random() + 1)) *
					Math.round(1000 * (Math.random() + 1))
			}
			, communityName = utils.randomString(12)
			, communitySlug = uslug(communityName)

		beforeEach(function(done) {
			var db = app.get('db')
				, Resident = db.daoFactoryManager.getDAO('Resident')
				, Community = db.daoFactoryManager.getDAO('Community')
				, Task = db.daoFactoryManager.getDAO('Task');

			eventBus = new EventEmitter();
			observer(eventBus, db);

			Achievement = db.daoFactoryManager.getDAO('Achievement');

			Resident.create(user).success(function residentCreated(createdResident) {
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
						resident.getAchievements()
							.success(function(achievements) {
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
	});
});