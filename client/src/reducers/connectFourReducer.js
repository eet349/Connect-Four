import {
	UPDATE_BOARDSTATE,
	TOGGLE_CURRENT_PLAYER,
	TOGGLE_CANPLAY,
	SET_WINNINGPLAYER,
	RESET_BOARDSTATE,
	SET_LASTPLAYED,
	SET_CURRENT_PLAYER_NAME,
} from '../actions/types';

const INITIAL_CONNECTFOUR_STATE = {
	boardState: [
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
	],
	currentPlayer: 1,
	currentPlayerName: '',
	winningPlayer: null,
	canPlay: true,
	lastPlayed: [],
	// I: null,
	// J: null,
};

const connectFourReducer = (state = INITIAL_CONNECTFOUR_STATE, action) => {
	switch (action.type) {
		case UPDATE_BOARDSTATE:
			return {
				...state,
				boardState: action.payload,
			};
		case TOGGLE_CURRENT_PLAYER:
			return { ...state, currentPlayer: action.payload };
		case TOGGLE_CANPLAY:
			return { ...state, canPlay: action.payload };
		case SET_CURRENT_PLAYER_NAME:
			return { ...state, currentPlayerName: action.payload };
		case SET_WINNINGPLAYER:
			return { ...state, winningPlayer: action.payload };
		case SET_LASTPLAYED:
			return { ...state, lastPlayed: action.payload };
		case RESET_BOARDSTATE:
			return {
				...state,
				boardState: action.payload,
			};
		// case SET_I_INDEX:
		// 	return { ...state, I: action.payload };
		// case SET_J_INDEX:
		// 	return { ...state, J: action.payload };
		default:
			return state;
	}
};

export default connectFourReducer;
