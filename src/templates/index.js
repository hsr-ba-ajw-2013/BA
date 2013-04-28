var path = require('path')
	, fs = require('fs')
	, templateFiles = fs.readdirSync(path.join(__dirname))
	, _ = require('underscore')
	, Handlebars = require('handlebars')
	, compiledTemplates = {};

/* Fix with correct implementation */
Handlebars.registerHelper('trans', function() {

});

_.each(templateFiles, function(file) {
	var ext = file.substr(file.length-4);

	if(file && ext === '.hbs') {
		var name = file.substr(0, file.length-4)
			, rawTemplate = fs.readFileSync(path.join(__dirname, file), 'utf-8')
			, compiledTemplate = Handlebars.compile(rawTemplate);

		if(compiledTemplate) {
			compiledTemplates[name] = compiledTemplate;
		}
	}
});

module.exports = compiledTemplates;