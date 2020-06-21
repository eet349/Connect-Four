const express = require('express');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());
// Bodyparser Middleware
app.use(bodyParser.json());

// MongoDB/Mongoose
// DB config
const db = require('./config/keys').mongoURI;

// Connect to Mongodb
mongoose
	.connect(db)
	.then(() => console.log('connected to mongodb...'))
	.catch((err) => console.log(err));

// Use routes

// router
const router = require('./routes/router');
app.use(router);
const profilesRouter = require('./routes/profiles');
app.use('/api/profiles/', profilesRouter);
// socket io
const io = socketio(server, { wsEngine: 'ws' });
const {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
	getNextPlayer,
} = require('./users.js');

io.on('connection', (socket) => {
	socket.on('join', ({ name, room }, callback) => {
		const { error, user } = addUser({
			id: socket.id,
			name: name,
			room: room,
		});
		if (error) {
			return callback(error);
		}
		socket.join(user.room);

		socket.emit('message', {
			user: 'admin',
			text: `${user.name}, welcome to ${user.room}.`,
		});

		io.to(user.room).emit('roomData', {
			room: user.room,
			users: getUsersInRoom(user.room),
			roomOccupancy: getUsersInRoom(user.room).length,
			currentPlayer: getUsersInRoom(user.room)[0],
		});
		callback();
	});

	socket.on('sendMessage', (message, callback) => {
		const user = getUser(socket.id);

		io.to(user.room).emit('message', { user: user.name, text: message });
		callback();
	});

	socket.on('playChip', ({ value, player, i, j, newState }) => {
		const user = getUser(socket.id);
		// const users = getUsersInRoom(user.room);
		// var currentPlayerServer = users[0];
		var currentPlayerServer = user.name;
		var nextCurrentPlayerServer = getNextPlayer(value);
		// if (player === currentPlayerServer.name) {
		if (player === currentPlayerServer) {
			const playedChipObject = {
				value,
				player,
				i,
				j,
				newState,
				nextPlayer: nextCurrentPlayerServer,
				// newUsers: rotateUsersInRoom(user.room),
			};
			io.to(user.room).emit('sentChip', playedChipObject);
		}
	});

	// socket.on('winner', (winner) => {
	// 	const user = getUser(socket.id);
	// 	console.log('winner: ', winner);
	// 	io.to(user.room).emit('won', winner);
	// });

	socket.on('disconnect', () => {
		const user = removeUser(socket.id);
		// console.log(`${user} has left the chat`);
		if (user) {
			io.to(user.room).emit('message', {
				user: 'admin',
				text: `${user.name} has left ${user.room}`,
			});
			io.to(user.room).emit('roomData', {
				room: user.room,
				users: getUsersInRoom(user.room),
			});
		}
	});
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
	console.log('Connected on port: ', PORT);
});
