/**
 * Community model
 */

var Schema = require('jugglingdb').Schema
	, path = require('path')
	, config = require(path.join(__dirname, '..', 'config'))
	, schema = new Schema(config.db.type, config.db.options);

var Community = schema.define('Community', {
	id: {type: Number, index: true, autoIncrement: true }
	, name: { type: String, length: 255 }
	, createdAt: { type: Date, default: Date.now }
	, updatedAt: { type: Date, default: Date.now }
});



module.exports = Community;