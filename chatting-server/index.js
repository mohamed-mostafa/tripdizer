// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var users = [];
var agents = [];
var rooms = [];

//room structure
/*
{
	name:"name",
	agent:"agentUsername",
	user:"userUsername",
	occupied: false,
}
*/

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'testing')));

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'add user', this listens and executes
  // newUser structure:
	/*{
		username: "username"
		type: "customer|agent"
	}*/

  socket.on('add user', function (newUser) {
    if (addedUser) return;
    console.log("User: " + newUser.username + " has joined");
    // we store the user in the socket session for this client
    socket.user = newUser;
    // if the user is an agent, we start a room for him
    if (newUser.type == "agent") {
    	console.log("User: " + newUser.username + " is an agent");
    	var newRoom = {};
    	newRoom.agentUsername = newUser.username;
    	newRoom.name = newUser.username + " Room";
    	newRoom.occupied = false;
    	socket.join(newRoom.name);
    	rooms.push(newRoom);

      socket.emit('login', {
        message: "You're now connected"
      });

    	console.log("Agent: " + newUser.username + " joined room: " + newRoom.name);
    }
    else if (newUser.type == "customer") { // if the user is a customer, we find an empty room for him
    	console.log("User: " + newUser.username + " is a customer");
    	if (rooms.length == 0) { // if the user is a customer, and we can't find any room (should never happen if we prevent him from starting the chat from the beginning)
    		console.log("Customer: " + newUser.username + " tried to chat, but there were no agents available");
    	} else {
    		var unoccupiedRooms = rooms.filter(function(room) {
    			return room.occupied == false; 
    		});
    		// if the user is a customer, all rooms are occupied
    		if (unoccupiedRooms.length == 0) {
    			console.log("Customer: " + newUser.username + " tried to chat, but all agents are occupied");
    		} else { // the user is a customer,and we could find an un-occupied room
    			var firstUnoccupiedRoom = unoccupiedRooms[0]; // use the first unoccupied room
    			socket.join(firstUnoccupiedRoom.name);
    			console.log("Customer: " + newUser.username + " joined room: " + firstUnoccupiedRoom.name);
    			rooms.forEach(function(room) {
					if (room.name == firstUnoccupiedRoom.name) {
  						room.occupied = true;
  						room.userUsername = newUser.username;
  					}
    			});

          socket.emit('login', {
            message: "You're now connected with " + firstUnoccupiedRoom.agentUsername
          });
    		}
    	}
    }
    addedUser = true;
  });

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    console.log("Socket communication from: " + socket.user.username + "(" + socket.user.type + ")");
  	var targetRoom = null;
    if (socket.user.type == 'customer') {
        targetRoom = rooms.filter(function (room) {
          return room.userUsername == socket.user.username;
        })[0];
    } else if (socket.user.type == 'agent') {
        targetRoom = rooms.filter(function (room) {
          return room.agentUsername == socket.user.username;
        })[0];
    }
    console.log("Room: " + targetRoom.name + " has a new message from: " + socket.user.username);
    // we tell the client to execute 'new message'
    socket.broadcast.to(targetRoom.name).emit('new message', {
      username: socket.user.username,
      message: data
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
  	var targetRoom = null;
    if (socket.user.type == 'customer') {
        targetRoom = rooms.filter(function (room) {
          return room.userUsername == socket.user.username;
        })[0];
    } else if (socket.user.type == 'agent') {
        targetRoom = rooms.filter(function (room) {
          return room.agentUsername == socket.user.username;
        })[0];
    }
    console.log("Room: " + targetRoom.name + " has a user started typing");
    socket.broadcast.to(targetRoom.name).emit('typing', {
      username: socket.user.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
  	var targetRoom = null;
    if (socket.user.type == 'customer') {
        targetRoom = rooms.filter(function (room) {
          return room.userUsername == socket.user.username;
        })[0];
    } else if (socket.user.type == 'agent') {
        targetRoom = rooms.filter(function (room) {
          return room.agentUsername == socket.user.username;
        })[0];
    }
    console.log("Room: " + targetRoom.name + " has a user stopped typing");
    socket.broadcast.to(targetRoom.name).emit('stop typing', {
      username: socket.user.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
	  	if (socket.user.type == "customer") {
	  		var targetRoom = rooms.filter(function (room) {
		  		return room.userUsername == socket.user.username;
		  	})[0];
	    	// leave the room he was occupying
	    	socket.leave(targetRoom.name);
	    	// mark the room as clear again
	    	rooms.forEach(function(room) {
				if (room.name == firstUnoccupiedRoom.name) {
					room.occupied = false
					room.userUsername = "";
				}
			});
	    	// notify the agent in the room
	      socket.broadcast.to(targetRoom.name).emit('user left', {
	        username: socket.user.userUsername
	      });
	  	} else if (socket.user.type == "agent") {
	  		var targetRoom = rooms.filter(function (room) {
		  		return room.agentUsername == socket.user.username;
		  	})[0];
	    	// leave the room he was occupying
	    	socket.leave(targetRoom.name);
	    	// mark the room as clear again
	    	rooms.forEach(function(room) {
				if (room.name == targetRoom.name) {
					room.occupied = false
					room.agentUsername = "";
				}
			});
	    	// notify the agent in the room
	      socket.broadcast.to(targetRoom.name).emit('agent left', {
	        username: socket.user.agentUsername
	      });
	  	};
    addedUser = false;
    }
  });
});