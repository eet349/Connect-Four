const users = [];

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
};
