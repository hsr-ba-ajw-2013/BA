/** Module: Observer
 * Observer of various events to process.
 */

var achievements = require('./achievements').achievements;

function taskDone(db, eventBus, data) {
	// remove event name (first value in data object)
	var data = Array.prototype.splice.call(data, 1, data.length);
	achievements.forEach(function(achivement) {
		achivement.giveAchievementIfMatches(db, data, function(matches) {
			if(matches) {
				eventBus.trigger('achievement:added');
			}
		})
	})
};

 module.exports = function setupObserver(eventBus, db) {
 	eventBus.on('task:done', taskDone.bind(this, db, eventBus));
 };