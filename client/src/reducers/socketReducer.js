import {
	// JOIN_ROOM,
	// LEAVE_ROOM,
	SET_ROOM,
	SET_USERS,
	SET_CURRENT_PLAYER,
	SET_USERNAME,
	SET_FIRSTPLAYER_NAME,
} from '../actions/types';

const INITIAL_STATE = {
	userName: null,
	userRoom: null,
	users: [],
	firstPlayer: '',
	currentPlayer: '',
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_USERNAME:
			return { ...state, userName: action.payload };
		case SET_FIRSTPLAYER_NAME:
			return { ...state, firstPlayer: action.payload };
		// case JOIN_ROOM:
		// 	return { ...state };
		// case LEAVE_ROOM:
		// 	return { ...state };
		case SET_ROOM:
			return { ...state, userRoom: action.payload };
		case SET_USERS:
			return { ...state, users: action.payload };
		case SET_CURRENT_PLAYER:
			return { ...state, currentPlayer: action.payload };
		default:
			return state;
	}
};
