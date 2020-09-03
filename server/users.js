// const Room = require('../models/room');

const users = [];
const rooms = [];

const addUser = ({ id, name, room }) => {
	// Javascript mastery = javascriptmastery
	name = name.trim().toLowerCase();
	room = room.trim().toLowerCase();

	const existingUser = users.find(
		(user) => user.room === room && user.name === name
	);
	if (!name || !room) return { error: 'Username and room are required' };
	if (existingUser) {
		return { error: 'Username is taken.' };
	}
	const user = { id, name, room };

	users.push(user);
	const roomCheck = rooms.map((room, i, arr) => {
		if (arr.length >= 1) {
			return room.roomName;
		}
		return 'empty';
	});
	console.log('roomCheck: ', roomCheck);
	const rmck = roomCheck.indexOf(room);
	if (rmck === -1) {
		rooms.push({ roomName: room, occupancy: 1, users: [{ id, name, room }] });
	} else {
		rooms[rmck] = {
			...rooms[rmck],
			users: [...rooms[rmck].users, { id, name, room }],
			occupancy: rooms[rmck].users.length + 1,
		};
	}
	rooms.map((room) => console.log('room: ', room));
	console.log('users: ', users);
	return { user };
};

const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id);

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
};
const getUser = (id) => users.find((user) => user.id === id);
const getUsersInRoom = (room) => users.filter((user) => user.room === room);
const getRoomsList = () => {
	return rooms;
};

const getNextPlayer = (value, room) => {
	const usersInRoom = users.filter((user) => user.room === room);
	if (usersInRoom.length > 1) {
		return value === 1 ? usersInRoom[1] : usersInRoom[0];
	} else {
		return { error: 'not enough users in room' };
	}
};

module.exports = {
	addUser,
	removeUser,
	getNextPlayer,
	getUser,
	getUsersInRoom,
	getRoomsList,
};
