function alterAchievemenTypeDataType(migration, DataTypes, done) {
	migration.changeColumn('Achievements', 'type', DataTypes.STRING)
		.complete(done)
		.error(function(err) {
			done(error)
		});
}

module.exports = {
  up: function(migration, DataTypes, done) {
    alterAchievemenTypeDataType(migration, DataTypes, done);
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
  }
}