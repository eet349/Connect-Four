const Room = require('./models/room');

const users = [];
var rooms = [];
Room.find({ numUsers: { $gte: 1 } }, (err, docs) => {
	if (err) {
		console.log('err: ', err);
	} else {
		// console.log('Room.find() result: ', docs);
		rooms = docs;
	}
});
console.log('rooms: ', rooms);
const addUser = ({ id, name, room, game }) => {
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
		// console.log('doc: ', doc);
		if (!doc) {
			newRoom.save((err, result) => {
				if (err) {
					console.log('err: ', err);
				} else {
					// console.log('result: ', result);
					rooms = [...rooms, result];
					// console.log('rooms in newRooms save: ', rooms);
				}
			});
		} else {
			var roomId;
			Room.find({ name: room }, (err, docs) => {
				if (err) {
					console.log('err: ', err);
				} else {
					roomId = docs[0]._id;
					// console.log('roomId: ', roomId);
					// console.log('users: ', users);
					const roomUsers = users.filter((user) => user.room === room);
					console.log('roomUsers: ', roomUsers);
					Room.findByIdAndUpdate(
						roomId,
						{
							numUsers: roomUsers.length,
							users: roomUsers,
						},
						(err, doc) => {
							if (err) console.log('err: ', err);
							else {
								// console.log('new room stats: ', doc);
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
	const roomNameToRemoveUser = users[index].room;
	// console.log('Users[index]: ', users[index].room);
	if (index !== -1) {
		const removedUser = users.splice(index, 1)[0];
		console.log('users in Remove user after splice: ', users);
		Room.find({ name: roomNameToRemoveUser }, (err, docs) => {
			if (err) console.log('err: ', err);
			else {
				const foundRoom = docs[0];
				const foundRoomId = foundRoom._id;
				const newUsers = users.filter(
					(user) => user.room === roomNameToRemoveUser
				);
				console.log('newUsers: ', newUsers);
				if (newUsers.length > 0) {
					Room.findByIdAndUpdate(
						foundRoomId,
						{
							numUsers: newUsers.length,
							users: newUsers,
						},
						(err, doc) => {
							if (err) console.log('err: ', err);
							else {
								console.log('new room stats: ', doc);
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

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const getRoomsList = () => {
	// rooms = Room.find({ numUsers: { $gte: 1 } });
	Room.find({ numUsers: { $gte: 1 } }, (err, docs) => {
		if (err) {
			console.log('err: ', err);
		} else {
			// console.log('Room.find() result: ', docs);

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
};
