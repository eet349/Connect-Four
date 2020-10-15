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
	// SET_CHANGE_GAME_MODAL_OPEN,
} from '../actions/types';

const INITIAL_STATE = {
	userName: null,
	userRoom: null,
	users: [],
	firstPlayer: '',
	currentPlayer: '',
	roomsList: [],
	roomsLoading: false,
	// changeGameModalOpen: false,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_USERNAME:
			return { ...state, userName: action.payload };
		case SET_FIRSTPLAYER_NAME:
			return { ...state, firstPlayer: action.payload };
		case SET_ROOM:
			return { ...state, userRoom: action.payload };
		case SET_USERS:
			return { ...state, users: action.payload };
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
		// case SET_CHANGE_GAME_MODAL_OPEN:
		// 	return { ...state, changeGameModalOpen: action.payload };
		default:
			return state;
	}
};
