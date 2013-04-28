
var express = require('express')
	, path = require('path')
	, _ = require('underscore')
	, fs = require('fs')
	, path = require('path')
	, app = express()
	, errors = require('barefoot').errors;


app.use(express.bodyParser());
app.use(express.static(path.join(process.cwd(),'src','public')));


var layoutTemplate = '<html><head><script src="/javascripts/lib/jquery-1.9.1.min.js"></script><script src="/javascripts/app.js"></script></head><body></body></html>';

function startExpressApp() {
	app.listen(3030, function() {
		console.log('Express server listening on port 3030');
	});
}

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
};

module.exports = {
	app: app
	, startExpressApp: startExpressApp
	, layoutTemplate: layoutTemplate
	//, apiRoutes: apiRoutes
	, mainJavaScriptFile: {
		route: '/javascripts/app.js'
		, file: path.join(process.cwd(), 'src', 'app.js')
		, exclude: [path.join(process.cwd(), 'src', 'barefootFactory.js')]
	}
};