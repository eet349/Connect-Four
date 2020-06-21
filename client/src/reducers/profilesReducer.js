import {
	GET_PLAYER_PROFILE,
	CREATE_PLAYER_PROFILE,
	UPDATE_PLAYER_PROFILE,
	PROFILES_LOADING,
} from '../actions/types';

const initialState = {
	profiles: [],
	loading: false,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case GET_PLAYER_PROFILE:
			return {
				...state,
				profiles: action.payload,
				loading: false,
			};
		case CREATE_PLAYER_PROFILE:
			return {
				...state,
				profiles: [action.payload, ...state.profiles],
			};
		case UPDATE_PLAYER_PROFILE:
			return {
				...state,
				profiles: [action.payload, ...state.profiles],
			};
		case PROFILES_LOADING:
			return {
				...state,
				loading: true,
			};
		default:
			return state;
	}
}
