var express = require('express');
var routes = require('./routes'); 
var http = require('http');
var path = require('path');
var app = express();
var partials = require('express-partials');

//port setup
app.set('port', process.env.PORT || 8000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

app.get('/', routes.course);
app.get('/course', routes.course);
app.get('/about', routes.about);

http.createServer(app).listen(app.get('port'), function( req, res ){ 
	//建立app instance
	//服務器通過app.listen（3000）;啟動，監聽3000端口。
	console.log('Express server listening on port ' + app.get('port'));
});