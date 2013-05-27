var url = require('url')
	, moment = require('moment');

Handlebars.registerHelper('stringify', function stringify(item) {
	return new Handlebars.SafeString(JSON.stringify(item));
});

Handlebars.registerHelper('safestring', function safestring(str) {
	return new Handlebars.SafeString(str);
});

Handlebars.registerHelper('trans', function trans(str, options) {
	return options.__(str, options);
});
Handlebars.registerHelper('blocktrans', function blocktrans(data, obj) {
	if (!obj) {
		obj = data;
		data = obj.hash;
	}
	return new Handlebars.SafeString(options.__(obj.fn(this), data));
});

Handlebars.registerHelper('hasProperties', function hasProperties(obj, options) {
	var self = this;
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop)) {
			return options.fn(self);
		}
		return;
	}
	return;
});
Handlebars.registerHelper('navIsActive', function navIsActive(uri, data, options) {
	if(data.requestPath.indexOf(uri) === 0) {
		return options.fn(this);
	}
	return;
});
Handlebars.registerHelper('url', function formatUrl(path, data) {
	var urlData = {
		protocol: data.protocol
		, host: data.host
		, pathname: path
	};

	return url.format(urlData);
});
Handlebars.registerHelper('for', function forLoop(from, to, incr, block) {
	var accum = '';
	for(var i = from; i < to; i += incr) {
		accum += block.fn(i);
	}
	return accum;
});
Handlebars.registerHelper('dateFormat', function dateFormat(context, block) {
	var f = block.hash.format || "LL";
	return moment(context).format(f);
});
Handlebars.registerHelper('debug', function debug(optionalValue) {
	console.log("Current Context");
	console.log("====================");
	console.log(this);

	if (optionalValue) {
		console.log("Value");
		console.log("====================");
		console.log(optionalValue);
	}
});