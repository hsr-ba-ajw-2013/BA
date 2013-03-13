"use strict";

/**
 * User model
 */

module.exports = function init(sequelize, DataTypes) {
	return sequelize.define('User', {
		facebookId: {
			type: DataTypes.INTEGER
			, unique: true
		}
		, name: DataTypes.STRING
		, disabled: {
			type: DataTypes.BOOLEAN
			, allowNull: false
			, defaultValue: false
		}
	});
};