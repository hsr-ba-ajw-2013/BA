function addIsAdmin(migration, DataTypes, done) {
	migration.addColumn('Residents', 'isAdmin', DataTypes.BOOLEAN)
		.complete(done)
		.error(function(error) {
			done(error);
		});
};

function updateResident(db, resident, done) {
	if (resident.isAdmin === null) {
		resident.isAdmin = false;
		resident.save().success(done)
		.error(function(error) {
			done(error);
		});
	} else {
		done();
	}
}

function addEnabled(migration, DataTypes, done) {
	migration.addColumn('Communities', 'enabled', DataTypes.BOOLEAN)
		.complete(done);
};

function updateCommunity(db, community, done) {
	var path = require('path')
		, communityController = require(path.join(__dirname, '..', 'src', 'lib', 'community', 'controller'));
	if (community.enabled === null) {
		community.enabled = true;
		community.save().success(done).error(done);
	}
}

function migrateExistingDataResidents(migration, DataTypes, done) {
	var db = migration.migrator.sequelize
		, crypto = require('crypto')
		, uslug = require('uslug')
		, path = require('path')
		, residentModel = require(path.join(__dirname, '..', 'src', 'lib', 'resident', 'model'))(null, db);

	db.daoFactoryManager.getDAO('Resident').findAll()
		.success(function(residents) {
			if (residents !== null) {
				residents.forEach(function(resident) {
					updateResident(db, resident, done);
				});
			}
		})
		.error(function(err) {
			done(err);
		});

}

function migrateExistingDataCommunity(migration, DataTypes, done) {
	var db = migration.migrator.sequelize
		, crypto = require('crypto')
		, uslug = require('uslug')
		, path = require('path')
		, residentModel = require(path.join(__dirname, '..', 'src', 'lib', 'community', 'model'))(null, db);

	db.daoFactoryManager.getDAO('Community').findAll()
		.success(function(communities) {
			if (communities !== null) {
				communities.forEach(function(community) {
					updateCommunity(db, community, done);
				});
			}
		})
		.error(function(err) {
			done(err);
		});

}


module.exports = {
  up: function(migration, DataTypes, done) {
	addIsAdmin(migration, DataTypes,
		addEnabled.bind(this, migration, DataTypes,
			migrateExistingDataResidents.bind(this, migration, DataTypes,
				migrateExistingDataCommunity.bind(this, migration, DataTypes, done)
			)
		)
	);
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('Residents', 'isAdmin');
	migration.removeColumn('Communities', 'enabled');
  }
}
