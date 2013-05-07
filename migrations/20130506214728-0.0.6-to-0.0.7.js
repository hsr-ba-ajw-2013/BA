function addIsAdmin(migration, DataTypes, done) {
	migration.addColumn('Residents', 'isAdmin', DataTypes.BOOLEAN)
		.complete(done);
};

function updateResident(db, resident, done) {
	var path = require('path')
		, residentController = require(path.join(__dirname, '..', 'src', 'lib', 'resident', 'controller'));
	if (resident.isAdmin === null) {
		resident.isAdmin = false;
		resident.save();
		done();
	}
}

function migrateExistingData(migration, DataTypes, done) {
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
				})
			}
		})
		.error(function(err) {
			done(err);
		});
}

module.exports = {
	up: function(migration, DataTypes, done) {
		addIsAdmin(migration, DataTypes, done);
	},
	down: function(migration) {
		migration.removeColumn('Residents', 'isAdmin');
	}
}
