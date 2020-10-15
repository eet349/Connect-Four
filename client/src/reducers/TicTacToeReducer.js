import {
	UPDATE_TICTAC_BOARDSTATE,
	TOGGLE_CURRENT_PLAYER,
	TOGGLE_TTT_CANPLAY,
	SET_WINNINGPLAYER,
	RESET_TTT_BOARDSTATE,
	SET_LASTPLAYED,
	SET_CURRENT_PLAYER_NAME,
} from '../actions/types';

const INITIAL_CONNECTFOUR_STATE = {
	ticTacBoardState: [0, 0, 0, 0, 0, 0, 0, 0, 0],
	currentPlayer: 1,
	currentPlayerName: '',
	winningPlayer: null,
	canPlay: true,
	lastPlayed: [],
};

const TicTacToeReducer = (state = INITIAL_CONNECTFOUR_STATE, action) => {
	switch (action.type) {
		case UPDATE_TICTAC_BOARDSTATE:
			return {
				...state,
				ticTacBoardState: action.payload,
			};
		case TOGGLE_CURRENT_PLAYER:
			return { ...state, currentPlayer: action.payload };
		case TOGGLE_TTT_CANPLAY:
			return { ...state, canPlay: action.payload };
		case SET_CURRENT_PLAYER_NAME:
			return { ...state, currentPlayerName: action.payload };
		case SET_WINNINGPLAYER:
			return { ...state, winningPlayer: action.payload };
		case SET_LASTPLAYED:
			return { ...state, lastPlayed: action.payload };
		case RESET_TTT_BOARDSTATE:
			return {
				...state,
				ticTacBoardState: action.payload,
			};
		default:
			return state;
	}
};

export default TicTacToeReducer;
