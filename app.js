var express = require('express');
var app = express();
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {});
server.listen(app, function() { });

wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // process WebSocket message
			
			connection.sendUTF(JSON.stringify({ type:'vote', data: message }));
        }
    });

    connection.on('close', function(connection) {
        // close user connection
    });
});

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

app.listen(3003);
