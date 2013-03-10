
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , sass = require('node-sass')
  , resource = require('express-resource')
  , resourceJuggling = require('resource-juggling')
  , config = require(path.join(__dirname, 'config'))
  , Schema = require('jugglingdb').Schema
  , schema = new Schema(config.db.type, config.db.options)
  , Task = require('./models/task')
  , Community = require('./models/community')
  , User = require('./models/user')
  , relationships = require('./models/relationships');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(config.cookieSecret));
  app.use(express.session());
  app.use(app.router);
  app.use(sass.middleware({
    src: path.join(__dirname, 'public', 'stylesheets', 'sass')
    , dest: path.join(__dirname, 'public', 'stylesheets')
    , debug: true
  }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//app.get('/', routes.index);
//app.get('/users', user.list);

app.resource('community', resourceJuggling.getResource({
  schema: schema
  , name: 'Community'
  , model: Community
  , base: '/api/'
}));
app.resource('task', resourceJuggling.getResource({
  schema: schema
  , name: 'Task'
  , model: Task
  , base: '/api/'
}));
app.resource('user', resourceJuggling.getResource({
  schema: schema
  , name: 'User'
  , model: User
  , base: '/api/'
}));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
