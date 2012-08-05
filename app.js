var express = require('express');
var app = express();
var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

io.sockets.on('connection', function(socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function(data) {
		console.log(data);
	});
});

// Routes
app.get('/', function(req, res){
  res.sendfile(__dirname + '/public/index.html');
});
app.get('/blank', function(req, res){
  res.sendfile(__dirname + '/public/index.html');
});
app.get('/votes', function(req, res){
  res.contentType('application/json');
  res.sendfile(__dirname + '/public/votes.json');
});

app.listen(80);