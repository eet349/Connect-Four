const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	numUsers: Number,
});

module.exports = Room = mongoose.model('room', RoomSchema);

// {"_id":{"$oid":"5ee56e6894c6881b74eba903"},"name":"POSTMAN TEST","userName":"test12345","email":"postman4life@email.com","stats":{"wins":{"$numberInt":"0"},"losses":{"$numberInt":"0"},"winLoss":{"$numberInt":"0"},"gamesPlayed":{"$numberInt":"0"}},"__v":{"$numberInt":"0"}}
