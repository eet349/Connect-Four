const express = require('express');
const ProfileRouter = express.Router();

const Profile = require('../models/profile');

// @route GET api/profiles
// @descr GET All Profiles
// @access Public
ProfileRouter.get('/', (req, res) => {
	Profile.find().then((profiles) => res.json(profiles));
});

// @route POST api/profiles
// @descr create a profile
// @access Public

ProfileRouter.post('/', (req, res) => {
	console.log('post request recieved');
	const newProfile = new Profile({
		name: req.body.name,
		userName: req.body.userName,
		email: req.body.email,
		stats: req.body.stats,
	});

	newProfile.save().then((profile) => res.json(profile));
});

// @route DELETE api/profiles
// @descr DELELTEs a profile
// @access Public
ProfileRouter.delete('/:id', (req, res) => {
	Profile.findById(req.params.id).then((profile) =>
		profile
			.remove()
			.then(() => res.json({ success: true }))
			.catch((err) => res.status(404).json({ success: false }))
	);
});

// @route UPDATE api/profiles
// @descr UPDATES a profile
// @access Public

ProfileRouter.put('/:id', (req, res) => {
	console.log('put request recieved');
	// var conditions = { _id: req.params.id };
	Profile.findOne({ _id: req.params.id }, (err, foundObject) => {
		if (err) {
			console.log(err);
			res.status(500).send();
		} else {
			if (!foundObject) {
				res.status(404).send();
			} else {
				if (req.body.name) {
					foundObject.name = req.body.name;
				}
				if (req.body.userName) {
					foundObject.userName = req.body.userName;
				}
				if (req.body.stats) {
					foundObject.stats = req.body.stats;
				}

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
	// .then((profile) =>
	// profile
	// 	.update(req.params.id, req.body)
	// 	.then((doc) => {
	// 		if (!doc) {
	// 			return res.status(404).end();
	// 		}
	// 		return res.status(200).json(doc);
	// 	})
	// .catch((err) => next(err))
	// );
});

module.exports = ProfileRouter;
