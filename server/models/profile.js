const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	userName: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	stats: {
		wins: Number,
		losses: Number,
		winLoss: Number,
		gamesPlayed: Number,
	},
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);

// {"_id":{"$oid":"5ee56e6894c6881b74eba903"},"name":"POSTMAN TEST","userName":"test12345","email":"postman4life@email.com","stats":{"wins":{"$numberInt":"0"},"losses":{"$numberInt":"0"},"winLoss":{"$numberInt":"0"},"gamesPlayed":{"$numberInt":"0"}},"__v":{"$numberInt":"0"}}
