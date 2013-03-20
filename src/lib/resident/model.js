"use strict";

/**
 * Resident model
 */

module.exports = function init(sequelize, DataTypes) {
	return sequelize.define('Resident', {
		facebookId: {
			type: DataTypes.BIGINT
			, unique: true
		}
		, name: DataTypes.STRING
		, enabled: {
			type: DataTypes.BOOLEAN
			, allowNull: false
			, defaultValue: true
		}
	});
};