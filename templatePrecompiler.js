/** File: Template Preprocessor
 * Creates precompiled handlebar templates and makes them available as a simple
 * common js module.
 */
var Handlebars = require('handlebars')
	, _ = require('underscore')
	, path = require('path')
	, fs = require('fs')
	, templatesSource = path.join(__dirname, 'src', 'shared', 'templates')
	, templatesDestination = path.join(templatesSource, 'precompiledTemplates.js')
	, precompiledTemplates = {};

/** Function: recursiveCompilationCrawler
 * Crawls a directory and its subdirectories recursivly. It looks for .hbs
 * files and precompiles their content using Handlebars.JS.
 * 
 * Parameters:
 *     (String) subdirectory - The directory to crawl
 *     (Object) precompiledTemplates - Already precompiled templates.
 *
 * Returns:
 *     (Object) an object literal containing all precompiled templates.
 */
function recursiveCompilationCrawler(subdirectory, precompiledTemplates) {
	precompiledTemplates = precompiledTemplates || {};

	var content = fs.readdirSync(subdirectory);

	_.each(content, function(file) {
		var filePath = path.join(subdirectory, file);

		if(fs.statSync(filePath).isFile()) {
			if(filePath.substr(filePath.length-4) === '.hbs') {
				var rawTemplate = fs.readFileSync(filePath, 'utf-8')
					, precompiledTemplate = Handlebars.precompile(rawTemplate);

				if(precompiledTemplate) {
					var name = file.replace('.hbs', '');
					precompiledTemplates[name] = precompiledTemplate;
				}
			}
		} else {
			precompiledTemplates[file] = {};
			recursiveCompilationCrawler(filePath, precompiledTemplates[file]);
		}
	});

	return precompiledTemplates;
}

/** Function: recursiveExporter
 * The resulting object of <recursiveCompilationCrawler> contains precompiled
 * templates. If a template was contained in a subfolder, it is nested in an
 * object named according to that folder.
 *
 * The CommonJS module which contains all templates will reflect that structure
 * 1:1. The <recursiveExporter> ensures that the object structure is set up
 * correctly and generates the source code for the templates module.
 *
 * Paramters:
 *     (Object) precompiledTemplates - The resulting object from
 *                                     <recursiveCompilationCrawler>
 *     (String) templateModule - Contains the CommonJS module source
 *     (String) templatePath - The path representing a template in the object
 *                             structure.
 *
 * Returns:
 *     (String) containing valid CommonJS module source code.
 */
function recursiveExporter(precompiledTemplates, templateModule, templatePath) {
	templatePath = templatePath || 'module.exports';

	_.each(precompiledTemplates, function(precompiledTemplate, name) {
		if(_.isString(precompiledTemplate)) {
			templateModule += templatePath + '.' + name +
							  ' = template(' + precompiledTemplate + ');';
		} else {
			var nextTemplatePath = templatePath + '.' + name;
			templateModule += nextTemplatePath + '={};';
			templateModule = recursiveExporter(
				precompiledTemplate
				, templateModule
				, nextTemplatePath);
		}
	});

	return templateModule;
}



precompiledTemplates = recursiveCompilationCrawler(templatesSource);
if(_.keys(precompiledTemplates).length > 0) {
	var stub = 'var Handlebars = require(\'handlebars\')\n' +
			   '	, template = Handlebars.template;\n'
		, templateModule = recursiveExporter(precompiledTemplates, stub);

	fs.writeFileSync(templatesDestination, templateModule, 'utf8');	
}