const express = require('express');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const server = http.createServer(app);
const cors = require('cors');

// Bodyparser Middleware
app.use(bodyParser.json());
// Use routes

//// router
const router = require('./routes/router');
app.use(router);
app.use(cors());
const profilesRouter = require('./routes/profiles');
app.use('/api/profiles/', profilesRouter);
const roomsRouter = require('./routes/rooms');
app.use('/api/rooms/', roomsRouter);

// MongoDB/Mongoose
//// DB config
const db = require('./config/keys').mongoURI;
const {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
	getNextPlayer,
	getRoomsList,
	clearDB,
} = require('./users.js');

//// Connect to Mongodb
mongoose
	.connect(db, { useFindAndModify: true })
	.then(() => {
		console.log('connected to mongodb...');
		clearDB();
	})
	.catch((err) => console.log(err));

// socket io
const io = socketio(server, { wsEngine: 'ws' });

io.on('connection', (socket) => {
	socket.on('join', ({ name, room, game, switchGame = false }, callback) => {
		console.log(
			'Join request!',
			'id: ',
			socket.id,
			'name: ',
			name,
			'room: ',
			room,
			'game: ',
			game,
			'switchGame: ',
			switchGame
		);
		const { error, user } = addUser({
			id: socket.id,
			name: name,
			room: room,
			game: game,
			switchGame: switchGame,
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

	socket.on('changeGameModalData', ({ changersName, userRoom, newGame }) => {
		console.log('changeGameModalData request recieved');
		const serverData = {
			changersName,
			room: userRoom,
			newGame,
		};
		console.log('serverData: ', serverData);
		io.to(userRoom).emit('serverChangeGameModalData', serverData);
	});

	socket.on('sendSwitchApproval', (sentSwitchData) => {
		console.log('approval recieved: ', sentSwitchData);
		io.to(sentSwitchData.room).emit('serverSwitchApproval', {
			name: sentSwitchData.name,
		});
	});

	socket.on('sendMessage', ({ name, room, message }, callback) => {
		io.to(room).emit('message', { user: name, text: message });
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

	socket.on('playTic', ({ value, player, index, newState, room }) => {
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
			console.log('played tic: ', playedTicObject);
			io.to(user.room).emit('sentTic', playedTicObject);
		}
	});

	socket.on('disconnect', () => {
		const user = removeUser(socket.id);
		console.log('user has left the room: ', user);
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
