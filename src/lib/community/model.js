"use strict";

/**
 * Community model
 */

module.exports = function init(db, DataTypes) {
	return db.define('Community', {
		name: DataTypes.STRING
	});
};