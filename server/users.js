const users = [];

const addUser = ({ id, name, room }) => {
	// Javascript mastery = javascriptmastery
	name = name.trim().toLowerCase();
	room = room.trim().toLowerCase();

	const existingUser = users.find(
		(user) => user.room === room && user.name === name
	);
	console.log('name: ', name);
	console.log('room: ', room);
	if (!name || !room) return { error: 'Username and room are required' };
	if (existingUser) {
		return { error: 'Username is taken.' };
	}
	// const canPlay = !users[0];
	const user = { id, name, room };
	// const user = { id, name, room, canPlay };

	users.push(user);

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
// const rotateUsersInRoom = (room) => {
// 	let temp = users[0];
// 	users[0] = users[1];
// 	users[1] = temp;
// 	return users;
// };
const getNextPlayer = (value) => {
	return value === 1 ? users[1] : users[0];
};

module.exports = {
	addUser,
	removeUser,
	getNextPlayer,
	getUser,
	getUsersInRoom,
	// rotateUsersInRoom,
};
