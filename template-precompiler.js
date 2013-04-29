/** File: Template Preprocessor
 * Creates precompiled handlebar templates and makes them available as a simple
 * common js module.
 */
var Handlebars = require('handlebars')
	, _ = require('underscore')
	, path = require('path')
	, fs = require('fs')
	, templatesSource = path.join(__dirname, 'src', 'templates')
	, templatesDestination = path.join(__dirname, 'src', 'templates', 'precompiled-templates.js')
	, templateFiles = fs.readdirSync(templatesSource)
	, precompiledTemplates = {}


_.each(templateFiles, function(file) {
	var ext = file.substr(file.length-4);

	if(file && ext === '.hbs') {
		var name = file.substr(0, file.length-4)
			, rawTemplate = fs.readFileSync(path.join(__dirname, 'src', 'templates', file), 'utf-8')
			, precompiledTemplate = Handlebars.precompile(rawTemplate);

		if(precompiledTemplate) {
			precompiledTemplates[name] = precompiledTemplate;
		}
	}
});

if(_.keys(precompiledTemplates).length > 0) {
	var templateModule =
		'var Handlebars = require(\'handlebars\')\n' +
		'	, template = Handlebars.template;\n';

	_.each(precompiledTemplates, function(precompiledTemplate, name) {
		templateModule +=
			'module.exports.' + name + ' = template(' + 
			precompiledTemplate + ');';
	});

	fs.writeFileSync(templatesDestination, templateModule, 'utf8')
}