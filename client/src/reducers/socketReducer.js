import {
	SET_ROOM,
	SET_USERS,
	SET_CURRENT_PLAYER,
	SET_USERNAME,
	SET_FIRSTPLAYER_NAME,
	UPDATE_ROOM_DATA,
	CREATE_NEW_ROOM,
	GET_ROOMS_LIST,
	DELETE_ROOM,
	ROOMS_LOADING,
	INCR_C4_SCORE,
	INCR_TTT_SCORE,
	INCR_RPS_SCORE,
} from '../actions/types';

const INITIAL_STATE = {
	userName: null,
	userRoom: null,
	users: [],
	firstPlayer: '',
	currentPlayer: '',
	roomsList: [],
	roomsLoading: false,
	scores: [],
};

var userIndex = null;
var winningPlayer = {};
var newScores = [];
var scoresInit = {};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_USERNAME:
			return {
				...state,
				userName: action.payload,
			};
		case SET_FIRSTPLAYER_NAME:
			return { ...state, firstPlayer: action.payload };
		case SET_ROOM:
			return { ...state, userRoom: action.payload };
		case SET_USERS:
			scoresInit = action.payload.map((user, userIndex) => {
				let tempC4Score =
					state.scores[userIndex] && state.scores[userIndex].C4Score
						? state.scores[userIndex].C4Score
						: 0;
				let tempTTTScore =
					state.scores[userIndex] && state.scores[userIndex].TTTScore
						? state.scores[userIndex].TTTScore
						: 0;
				let tempRPSScore =
					state.scores[userIndex] && state.scores[userIndex].RPSScore
						? state.scores[userIndex].RPSScore
						: 0;

				return {
					name: user.name,
					C4Score: tempC4Score,
					TTTScore: tempTTTScore,
					RPSScore: tempRPSScore,
				};
			});
			return {
				...state,
				users: action.payload,
				scores: scoresInit,
			};
		case SET_CURRENT_PLAYER:
			return { ...state, currentPlayer: action.payload };
		case CREATE_NEW_ROOM:
			return { ...state, roomsList: [...state.roomsList, action.payload] };
		case GET_ROOMS_LIST:
			return {
				...state,
				roomsList: action.payload,
				roomsLoading: false,
			};
		case UPDATE_ROOM_DATA:
			return {
				...state,
				roomsList: action.payload,
				roomsLoading: false,
			};
		case DELETE_ROOM:
			return {
				...state,
				roomsList: state.roomList.filter((room) => room._id !== action.payload),
			};
		case ROOMS_LOADING:
			return { ...state, roomsLoading: true };
		case INCR_C4_SCORE:
			userIndex = state.scores.findIndex((elm) => elm.name === action.payload);
			winningPlayer = state.scores.find((elm) => elm.name === action.payload);
			winningPlayer = { ...winningPlayer, C4Score: ++winningPlayer.C4Score };
			newScores = state.scores.map((score) => {
				if (score.name === action.payload) {
					return winningPlayer;
				} else return score;
			});
			return {
				...state,
				scores: newScores,
			};
		case INCR_TTT_SCORE:
			userIndex = state.scores.findIndex((elm) => elm.name === action.payload);
			winningPlayer = state.scores.find((elm) => elm.name === action.payload);
			winningPlayer = { ...winningPlayer, TTTScore: ++winningPlayer.TTTScore };
			newScores = state.scores.map((score) => {
				if (score.name === action.payload) {
					return winningPlayer;
				} else return score;
			});
			return {
				...state,
				scores: newScores,
			};
		case INCR_RPS_SCORE:
			userIndex = state.scores.findIndex((elm) => elm.name === action.payload);
			winningPlayer = state.scores.find((elm) => elm.name === action.payload);
			winningPlayer = { ...winningPlayer, RPSScore: ++winningPlayer.RPSScore };
			newScores = state.scores.map((score) => {
				if (score.name === action.payload) {
					return winningPlayer;
				} else return score;
			});
			return {
				...state,
				scores: newScores,
			};
		default:
			return state;
	}
};
