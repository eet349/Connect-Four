import { SET_RPS_WINNINGPLAYER } from '../actions/types';

const INITIAL_RPS_STATE = {
	winningPlayer: '',
	canPlay: true,
};

const RockPaperScissorsReducer = (state = INITIAL_RPS_STATE, action) => {
	switch (action.type) {
		case SET_RPS_WINNINGPLAYER:
			return { ...state, winningPlayer: action.payload };
		default:
			return state;
	}
};

export default RockPaperScissorsReducer;
