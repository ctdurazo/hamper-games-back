const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongo = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'

app.get('/', function (req, res) {
    // TODO: link this to our frontend
    res.send('<h1>Index</h1>');
});

app.all('*', (req, res) => {
    // ( ͡ ͜ʖ ͡)
    res.status(418).send("<h1>I'm a teapot</h1>");
});

let usernames = {};
let rooms = [];

io.on('connection', function (socket) {
    console.log('a user connected');
	socket.on('adduser', function(username, room){
		socket.username = username;
		socket.room = room;
		usernames[username] = username;
		socket.join(room);
		socket.emit('updatechat', 'SERVER', 'you have connected to ' + room);
		socket.broadcast.to(room).emit('updatechat', 'SERVER', username + ' has connected to this room');
		socket.emit('updaterooms', rooms, room);
	});
	socket.on('disconnect', function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
