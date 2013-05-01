var Handlebars = require('handlebars')
	, template = Handlebars.template;
module.exports.login = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n			<h5 class=\"subheader\">\n				";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.trans),stack1 ? stack1.call(depth0, "Please login with your Facebook account in order to use Roomies.", options) : helperMissing.call(depth0, "trans", "Please login with your Facebook account in order to use Roomies.", options)))
    + "\n			</h5>\n			<p>\n				<a href=\"/auth/facebook\" class=\"facebook button\"><i class=\"icon-facebook\"></i> ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.trans),stack1 ? stack1.call(depth0, "Login with Facebook", options) : helperMissing.call(depth0, "trans", "Login with Facebook", options)))
    + "</a>\n			</p>\n		";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n			";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.trans),stack1 ? stack1.call(depth0, "Hello %s", ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.name), options) : helperMissing.call(depth0, "trans", "Hello %s", ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.name), options)))
    + "\n		";
  return buffer;
  }

  buffer += "<div class=\"row\">\n	<div class=\"large-6 small-9 small-centered columns text-center\">\n		<img src=\"images/roomies-shield.png\" width=\"225\" height=\"188\" />\n		<h4>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.trans),stack1 ? stack1.call(depth0, "Welcome at Roomies!", options) : helperMissing.call(depth0, "trans", "Welcome at Roomies!", options)))
    + "</h4>\n		";
  stack2 = helpers.unless.call(depth0, depth0.user, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n		";
  stack2 = helpers['if'].call(depth0, depth0.user, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n	</section>\n</div>";
  return buffer;
  });module.exports.menu = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n					<li>\n						<a href=\"/community/"
    + escapeExpression(((stack1 = ((stack1 = depth0.community),stack1 == null || stack1 === false ? stack1 : stack1.slug)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/task\" title=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.trans),stack1 ? stack1.call(depth0, "Tasks", options) : helperMissing.call(depth0, "trans", "Tasks", options)))
    + "\">\n							<i class=\"icon-list icon-large\"></i>\n							<span class=\"item-label\"> ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.trans),stack1 ? stack1.call(depth0, "Tasks", options) : helperMissing.call(depth0, "trans", "Tasks", options)))
    + "</span>\n						</a>\n					</li>\n					<li>\n						<a href=\"/community/"
    + escapeExpression(((stack1 = ((stack1 = depth0.community),stack1 == null || stack1 === false ? stack1 : stack1.slug)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/rank\" title=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.trans),stack1 ? stack1.call(depth0, "Ranking", options) : helperMissing.call(depth0, "trans", "Ranking", options)))
    + "\">\n							<i class=\"icon-trophy icon-large\"></i>\n							<span class=\"item-label\"> ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.trans),stack1 ? stack1.call(depth0, "Ranking", options) : helperMissing.call(depth0, "trans", "Ranking", options)))
    + "</span>\n						</a>\n					</li>\n					<li>\n						<a href=\"/community/"
    + escapeExpression(((stack1 = ((stack1 = depth0.community),stack1 == null || stack1 === false ? stack1 : stack1.slug)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/invite\" title=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.trans),stack1 ? stack1.call(depth0, "Invite", options) : helperMissing.call(depth0, "trans", "Invite", options)))
    + "\">\n							<i class=\"icon-share icon-large\"></i>\n							<span class=\"item-label\"> ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.trans),stack1 ? stack1.call(depth0, "Invite", options) : helperMissing.call(depth0, "trans", "Invite", options)))
    + "</span>\n						</a>\n					</li>\n				";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n			<a href=\"/logout\" title=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.trans),stack1 ? stack1.call(depth0, "Logout", options) : helperMissing.call(depth0, "trans", "Logout", options)))
    + "\" class=\"right logout\"><i class=\"icon-signout\"></i></a>\n			<ul class=\"right\">\n				<li class=\"account\">\n					<a href=\"https://facebook.com/"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.facebookId)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n						<span class=\"item-label\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n						<img class=\"avatar small\" src=\"//graph.facebook.com/"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.facebookId)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/picture\" />\n					</a>\n				</li>\n			</ul>\n			";
  return buffer;
  }

  buffer += "<div class=\"fixed-navigation\">\n	<nav class=\"navigation\" role=\"navigation\">\n		<div class=\"title-area\">\n			<a href=\"/\" class=\"banner\" title=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.trans),stack1 ? stack1.call(depth0, "Roomies", options) : helperMissing.call(depth0, "trans", "Roomies", options)))
    + "\"><h1>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.trans),stack1 ? stack1.call(depth0, "Roomies", options) : helperMissing.call(depth0, "trans", "Roomies", options)))
    + "</h1></a>\n		</div>\n		<section class=\"nav-section\">\n			<ul class=\"left\">\n				";
  stack2 = helpers['if'].call(depth0, depth0.user, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n			</ul>\n			";
  stack2 = helpers['if'].call(depth0, depth0.user, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n		</section>\n	</nav>\n</div>";
  return buffer;
  });