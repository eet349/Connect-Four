const Room = require('./models/room');

var users = [];
var rooms = [];
Room.find({ numUsers: { $gte: 1 } }, (err, docs) => {
	if (err) {
		console.log('err: ', err);
	} else {
		rooms = docs;
	}
});
// console.log('rooms: ', rooms);
const addUser = ({ id, name, room, game, switchGame }) => {
	name = name.trim().toLowerCase();
	room = room.trim().toLowerCase();

	const existingUser = users.find(
		(user) => user.room === room && user.name === name
	);
	if (!name || !room) return { error: 'Username and room are required' };
	if (existingUser && !switchGame) {
		return { error: 'Username is taken.' };
	}
	if (existingUser && switchGame) {
		console.log('exixtingUser: found && switchGame: true');
		removeUser(existingUser.id);
	}
	const user = { id, name, room, game };

	users.push(user);
	const roomUsers = users.filter((user) => {
		return user.room === room;
	});

	const newRoom = new Room({
		name: room,
		numUsers: roomUsers.length,
		users: roomUsers,
		game: game,
	});
	Room.exists({ name: room }, (err, doc) => {
		if (err) {
			console.log('err: ', err);
		} else {
		}
		if (!doc) {
			newRoom.save((err, result) => {
				if (err) {
					console.log('err: ', err);
				} else {
					rooms = [...rooms, result];
				}
			});
		} else {
			var roomId;
			Room.find({ name: room }, (err, docs) => {
				if (err) {
					console.log('err: ', err);
				} else {
					roomId = docs[0]._id;
					const roomUsers = users.filter((user) => user.room === room);
					Room.findByIdAndUpdate(
						roomId,
						{
							numUsers: roomUsers.length,
							users: roomUsers,
							game: game,
						},
						(err, doc) => {
							if (err) console.log('err: ', err);
							else {
							}
						}
					);
				}
			});
		}
	});

	return { user };
};

const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id);
	if (users.length < 1) return { error: 'There are no users in the database.' };
	else if (index === -1)
		return { error: 'That index was not found in users array.' };

	const roomNameToRemoveUser = users[index].room;
	if (index !== -1) {
		const removedUser = users.splice(index, 1)[0];
		// console.log('users in Remove user after splice: ', users);
		Room.find({ name: roomNameToRemoveUser }, (err, docs) => {
			if (err) console.log('err: ', err);
			else {
				const foundRoom = docs[0];
				const foundRoomId = foundRoom._id;
				const newUsers = users.filter(
					(user) => user.room === roomNameToRemoveUser
				);
				if (newUsers.length > 0) {
					// console.log('newUsers: ', newUsers);

					Room.findByIdAndUpdate(
						foundRoomId,
						{
							numUsers: newUsers.length,
							users: newUsers,
						},
						(err, doc) => {
							if (err) console.log('err: ', err);
							else {
								// console.log('new room stats: ', doc);
							}
						}
					);
				} else {
					Room.findByIdAndDelete(foundRoomId, (err, doc) => {
						if (err) console.log('err: ', err);
						else {
							console.log('removed doc: ', doc);
						}
					});
				}
			}
		});
		return removedUser;
	}
};

const getUser = (id) => users.find((user) => user.id === id);
const getUserByNameAndRoom = (name, room) =>
	users.find((user) => user.name === name && user.room === room);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const getRoomsList = () => {
	Room.find({ numUsers: { $gte: 1 } }, (err, docs) => {
		if (err) {
			console.log('err: ', err);
		} else {
			rooms = docs;
			if (users.length < 1) {
				rooms.forEach((room) =>
					room.users.forEach((user) => (users = [...users, user]))
				);
			}
			return rooms;
		}
	});

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

const clearDB = () => {
	return Room.deleteMany({}, () => console.log('deleted all'));
};

module.exports = {
	addUser,
	removeUser,
	getNextPlayer,
	getUser,
	getUsersInRoom,
	getRoomsList,
	clearDB,
	getUserByNameAndRoom,
};
