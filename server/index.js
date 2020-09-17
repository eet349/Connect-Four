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
//// DB config
const db = require('./config/keys').mongoURI;

//// Connect to Mongodb
mongoose
	.connect(db, { useFindAndModify: true })
	.then(() => console.log('connected to mongodb...'))
	.catch((err) => console.log(err));

// Use routes

//// router
const router = require('./routes/router');
app.use(router);
const profilesRouter = require('./routes/profiles');
app.use('/api/profiles/', profilesRouter);
const roomsRouter = require('./routes/rooms');
app.use('/api/rooms/', roomsRouter);
// socket io
const io = socketio(server, { wsEngine: 'ws' });

const {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
	getNextPlayer,
	getRoomsList,
} = require('./users.js');

io.on('connection', (socket) => {
	socket.on('join', ({ name, room, game }, callback) => {
		const { error, user } = addUser({
			id: socket.id,
			name: name,
			room: room,
			game: game,
		});
		if (error) {
			return callback(error);
		}
		socket.join(user.room);

		socket.emit('message', {
			user: 'admin',
			text: `${user.name}, welcome to ${user.room}.`,
		});

		socket.broadcast
			.to(user.room)
			.emit('message', { user: 'admin', text: `${user.name} has joined.` });

		io.to(user.room).emit('roomData', {
			room: user.room,
			users: getUsersInRoom(user.room),
			roomOccupancy: getUsersInRoom(user.room).length,
			currentPlayer: getUsersInRoom(user.room)[0],
			roomsList: getRoomsList(),
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
		var currentPlayerServer = user.name;
		var nextCurrentPlayerServer = getNextPlayer(value, user.room);
		if (player === currentPlayerServer) {
			const playedChipObject = {
				value,
				player,
				i,
				j,
				newState,
				nextPlayer: nextCurrentPlayerServer,
			};
			io.to(user.room).emit('sentChip', playedChipObject);
		}
	});

	socket.on('playTic', ({ value, player, index, newState }) => {
		// console.log('getUser: ', getUser(socket.id), socket.id);
		// console.log('user: ', user);
		const user = getUser(socket.id);
		var currentPlayerServer = user.name;
		var nextCurrentPlayerServer = getNextPlayer(value, user.room);
		if (player === currentPlayerServer) {
			const playedTicObject = {
				value,
				player,
				index,
				newState,
				nextPlayer: nextCurrentPlayerServer,
			};
			io.to(user.room).emit('sentTic', playedTicObject);
		}
	});

	socket.on('disconnect', () => {
		const user = removeUser(socket.id);
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
