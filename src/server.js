const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Deck = require('./schemas/deck');

app.get('/', function (req, res) {
	// TODO: link this to our frontend
	res.send('<h1>Index</h1>');
});

app.get('/testDeck', function(req, res){
	let deck = new Deck(0,0);
	setTimeout(function() {
		console.log(deck);
		res.json(deck);
	}, 1000);
});

app.all('*', (req, res) => {
	// ( ͡ ͜ʖ ͡)
	res.status(418).send("<h1>I'm a teapot</h1>");
});

let usernames = {};
let rooms = [];

io.on('connection', function (socket) {
	console.log('a user connected');
	
	socket.on('adduser', function (username, room) {
		socket.username = username;
		socket.room = room;
		usernames[username] = username;
		socket.join(room);
		socket.emit('updatechat', 'SERVER', 'you have connected to ' + room);
		socket.broadcast.to(room).emit('updatechat', 'SERVER', username + ' has connected to this room');
		socket.emit('updaterooms', rooms, room);
	});

	socket.on('disconnect', function () {
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
});

http.listen(3000, function () {
	console.log('listening on *:3000');
});
