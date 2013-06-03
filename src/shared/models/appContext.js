/** Class: Models.AppContext
 * AppContext model as a subclass of <Barefoot.Model at
 * http://swissmanu.github.io/barefoot/docs/files/lib/model-js.html>
 */
var Barefoot = require('node-barefoot')()
	, Model = Barefoot.Model
	, AppContextModel = Model.extend({
		toString: function toString() {
			return 'AppContextModel';
		}
	});

module.exports = AppContextModel;