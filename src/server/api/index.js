var apiRoutes = {
	get: {
		'/test': function() {
			console.log(this.req.locale);
		}
	}
};

/*
var apiRoutes = {
	get: {
		'/contacts': function(query) {
			console.log('bäm, here are your contacts', query);
			return contacts;
		}
	}
	, post: {
		'/contacts': function(contact, query) {
			console.log('yay, save a contact', contact, query);
		}
		, '/notfound': function() {
			throw new errors.NotFoundError('yay, errors are working :)');
		}
	}
	, put: {
		'/contacts': function(contact, query) {
			console.log('yay, update a contact', contact, query);
			contacts.push(contact);
			console.log(contacts);
		}
	}
	, del: {
		'/contacts/:id/:name': function(id, name, query) {
			console.log(':( delete a contact', id, name, query);
		}
	}
};*/

module.exports = { routes: apiRoutes };