"use strict";

/**
 * Community model
 */

module.exports = function init(sequelize, DataTypes) {
	return sequelize.define('Community', {
		name: DataTypes.STRING
	});
};