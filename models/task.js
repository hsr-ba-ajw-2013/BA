"use strict";

/**
 * Task model
 */

module.exports = function init(sequelize, DataTypes) {
	return sequelize.define('Task', {
		name: DataTypes.STRING
		, description: DataTypes.STRING
	});
}