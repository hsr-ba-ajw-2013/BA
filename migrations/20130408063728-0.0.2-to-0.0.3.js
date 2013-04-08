module.exports = {
  up: function(migration, DataTypes) {
    migration.addColumn('Communities', 'shareLink', {
    	type: DataTypes.STRING, unique: true
    });
    migration.addColumn('Communities', 'slug', {
    	type: DataTypes.STRING, unique: true
    });
  },
  down: function(migration) {
    migration.removeColumn('Communities', 'shareLink');
    migration.removeColumn('Communities', 'slug');
  }
}