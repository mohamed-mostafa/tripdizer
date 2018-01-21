var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var users = [];
var agents = [];
var conversations = [];


io.on('connection', function(socket){
  console.log('a user connected - adding the user to the list of users');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});