/** File: Forms
 * Form utilities for Backbone syncing.
 */
var models = require('./models')
	, API_PREFIX = '/api';

/** PrivateFunction: _displayValidationErrors
 * Displays validation errors returned by the API.
 *
 * Parameters:
 *   (Object) response - AJAX response
 */
function _displayValidationErrors(response) {
	var messages = response.responseText.split(',');
	this.options.eventAggregator.trigger('view:flashmessage', {
		error: messages
	});
}

/** PrivateFunction: _formSyncModel
 * Syncs a model with the API.
 *
 * Parameters:
 *   (String) collection - Collection name in the DataStore.
 *   (String) model - Model name
 *   (Object) data - Data serialized from form
 *   (String) url - URL to sync to
 *   (Function) successCb - Callback in case of a successful sync
 *   (Function) errorCb - Callback in case of a errored sync
 */
function _formSyncModel(collection, model, data, url, successCb, errorCb) {
	var Model = models[model]
		, self = this;
	if(!Model) {
		throw new Error('Invalid or not existing model assigned to the form.');
	}
	model = new Model(data, {
		url: API_PREFIX + url
	});
	model.save(null, {
		success: function success(model) {
			if(collection) {
				collection.add(model, {
					at: 0
				});
			}
			successCb.apply(self, arguments);
		}
		, error: function error(model, response) {
			_displayValidationErrors.call(self, response);
			errorCb.apply(self, arguments);
		}
	});
}

/** PrivateFunction: _formSyncModelInCollection
 * Creates a new model on the API side using <Backbone.Model.sync at
 * http://backbonejs.org/#Model-sync>.
 *
 * Parameters:
 *   (Integer) id - Id of the model in the collection
 *   (String) collection - Collection name in the DataStore.
 *   (Object) data - Data serialized from form
 *   (Function) successCb - Callback in case of a successful sync
 *   (Function) errorCb - Callback in case of a errored sync
 */
function _formSyncModelInCollection(id, collection, data, successCb, errorCb) {
	if(!collection) {
		throw new Error('Invalid or not existing collection assigned to' +
			' the form.');
	}

	var model = collection.get(id)
		, self = this;
	if(!model) {
		throw new Error('Invalid or not existing id assigned to the form.');
	}
	model.set(data);
	model.save(null, {
		success: function success() {
			successCb.apply(self, arguments);
		}
		, error: function error(model, response) {
			_displayValidationErrors.call(self, response);
			errorCb.apply(self, arguments);
		}
	});
}

/** PrivateFunction: _serializeFormToObject
 * Takes a form and uses <jQuery.serializeArray() at
 * http://api.jquery.com/serializeArray/> in order to transfer it
 * to an object.
 *
 * Parameters:
 *   (Element) $form - Form element
 *
 * Returns:
 *   (Object) - Form fields serialized
 */
function _serializeFormToObject($form) {
	var dataArray = $form.serializeArray()
		, data = {};
	for(var i = 0, l = dataArray.length; i < l; i++) {
		var field = dataArray[i];
		data[field.name] = field.value;
	}
	return data;
}

/** Function: formSync
 * Reads data from a form and tries to match the data with an existing
 * model or creates a new one.
 * It then syncs the data with the API.
 *
 * Parameters:
 *   (Element) $form - Form element
 *   (Function) success - Callback in case of a successful sync
 *   (Function) error - Callback in case of a errored sync
 */
function formSync($form, success, error) {
	var model = $form.data('model')
		, id = $form.data('id')
		, collection = $form.data('collection')
		, url = $form.attr('action');
	if(id && !collection) {
		throw new Error('If there\'s an Id given, a collection needs to be ' +
			' submitted as well.');
	}
	if(!id && (!model || !collection)) {
		throw new Error('Model & Collection need to be specified if there\'s' +
			' no id');
	}
	collection = this.getDataStore().get(collection);

	var data = _serializeFormToObject($form);

	if(model) {
		_formSyncModel.call(this, collection, model, data, url, success, error);
	} else {
		_formSyncModelInCollection.call(this, id, collection, data, success
			, error);
	}
}

module.exports = formSync;