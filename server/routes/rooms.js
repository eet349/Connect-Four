const express = require('express');
const RoomsRouter = express.Router();

const Room = require('../models/room');

// @route GET api/profiles
// @descr GET All Profiles
// @access Public
RoomsRouter.get('/', (req, res) => {
	Room.find().then((rooms) => res.json(rooms));
});

// @route POST api/profiles
// @descr create a profile
// @access Public

RoomsRouter.post('/', (req, res) => {
	console.log('post request recieved');
	const newRoom = new Room({
		name: req.body.name,
		numUsers: req.body.numUsers,
	});

	newRoom.save().then((room) => res.json(room));
});

// RoomsRouter.put('/:id', (req, res) => {
// 	console.log('put request recieved');
// 	// var conditions = { _id: req.params.id };
// 	Room.findOne({ _id: req.params.id }, (err, foundObject) => {
// 		if (err) {
// 			console.log(err);
// 			res.status(500).send();
// 		} else {
// 			if (!foundObject) {
// 				res.status(404).send();
// 			} else {
// 				if (req.body.name) {
// 					foundObject.name = req.body.name;
// 				}
// 				if (req.body.numUsers) {
// 					foundObject.numUsers = req.body.numUsers;
// 				}

// 				foundObject.save((err, updatedObject) => {
// 					if (err) {
// 						console.log(err);
// 						res.status(500).send();
// 					} else {
// 						res.send(updatedObject);
// 					}
// 				});
// 			}
// 		}
// 	});
// });

RoomsRouter.put('/:roomName', (req, res) => {
	console.log('put request recieved');
	// var conditions = { _id: req.params.id };
	Room.findOne({ name: req.params.roomName }, (err, foundObject) => {
		if (err) {
			console.log(err);
			res.status(500).send();
		} else {
			if (!foundObject) {
				res.status(404).send();
			} else {
				if (req.body.game) {
					foundObject.game = req.body.game;
				}
				// if (req.body.numUsers) {
				// 	foundObject.numUsers = req.body.numUsers;
				// }

				foundObject.save((err, updatedObject) => {
					if (err) {
						console.log(err);
						res.status(500).send();
					} else {
						res.send(updatedObject);
					}
				});
			}
		}
	});
});

// @route DELETE api/profiles
// @descr DELELTEs a profile
// @access Public
RoomsRouter.delete('/:id', (req, res) => {
	Room.findById(req.params.id).then((room) =>
		room
			.remove()
			.then(() => res.json({ success: true }))
			.catch((err) => res.status(404).json({ success: false }))
	);
});

module.exports = RoomsRouter;
