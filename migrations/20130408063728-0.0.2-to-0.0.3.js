function addFulfilledAt(migration, DataTypes, done) {
	migration.addColumn('Tasks', 'fulfilledAt', DataTypes.DATE)
		.complete(done);
};

function addDueDate(migration, DataTypes, done) {
	migration.addColumn('Tasks', 'dueDate', DataTypes.DATE)
		.complete(done);
};

function addReward(migration, DataTypes, done) {
	migration.addColumn('Tasks', 'reward', DataTypes.INTEGER)
		.complete(done);
};

function addShareLink(migration, DataTypes, done) {
	migration.addColumn('Communities', 'shareLink', {
		type: DataTypes.STRING, unique: true
	}).complete(done);
};

function addSlug(migration, DataTypes, done) {
	migration.addColumn('Communities', 'slug', {
		type: DataTypes.STRING, unique: true
	}).complete(done);
}

function updateCommunity(db, community, done) {
	var path = require('path')
		, communityController = require(path.join(__dirname, '..', 'src', 'lib', 'community', 'controller'));
	// if there's no slug, we can assume there's no shareLink either.
	if (community.slug === null) {
		communityController.addUniqueSlug(db, community, function(err) {
			if(err) {
				return done(err);
			}
			communityController.createUniqueShareLink(db, function(err, link) {
				if(err) {
					return done(err);
				}
				community.shareLink = link;
				community.save();
				done();
			});
		});
	}
}

function migrateExistingData(migration, DataTypes, done) {
	var db = migration.migrator.sequelize
		, crypto = require('crypto')
		, uslug = require('uslug')
		, path = require('path')
		, communityModel = require(path.join(__dirname, '..', 'src', 'lib', 'community', 'model'))(null, db);

	db.daoFactoryManager.getDAO('Community').findAll()
		.success(function(communities) {
			if (communities !== null) {
				communities.forEach(function(community) {
					updateCommunity(db, community, done);
				})
			}
		})
		.error(function(err) {
			done(err);
		});
}

module.exports = {
	up: function(migration, DataTypes, done) {
		addShareLink(migration, DataTypes,
			addSlug.bind(this, migration, DataTypes,
				migrateExistingData.bind(this, migration, DataTypes,
					addFulfilledAt.bind(this, migration, DataTypes,
						addDueDate.binf(this.migration, DataTypes,
							addReward.bind(this, migration, DataTypes, done)
						)
					)
				)
			)
		);
	},
	down: function(migration) {
		migration.removeColumn('Communities', 'shareLink');
		migration.removeColumn('Communities', 'slug');

		migration.removeColumn('Tasks', 'fulfilledAt');
		migration.removeColumn('Tasks', 'dueDate');
		migration.removeColumn('Tasks', 'reward');
	}
}
