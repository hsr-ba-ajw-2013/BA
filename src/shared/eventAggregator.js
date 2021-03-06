/** Class: EventAggregator
 * A simple object which can trigger events an register handlers on events.
 * It extends the backbone/barefoot Events object and has the same API 
 * thereafter.
 *
 * See also:
 * * <Backbone.Events at http://backbonejs.org/#Events>
 */
var Barefoot = require('node-barefoot')()
	, _ = require('underscore');

function EventAggregator() {
	return this;
}

_.extend(EventAggregator.prototype, Barefoot.Events);

module.exports = EventAggregator;