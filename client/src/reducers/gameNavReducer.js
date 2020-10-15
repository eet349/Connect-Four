import {
	SET_CHANGE_GAME_MODAL_OPEN,
	SET_PLAYER_SWITCH_APPROVAL,
	SET_OPPONENT_SWITCH_APPROVAL,
} from '../actions/types';

const INITIAL_STATE = {
	changeGameModalOpen: false,
	playerSwitchApproval: false,
	opponentSwitchApproval: false,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_CHANGE_GAME_MODAL_OPEN:
			return { ...state, changeGameModalOpen: action.payload };
		case SET_PLAYER_SWITCH_APPROVAL:
			return { ...state, playerSwitchApproval: action.payload };
		case SET_OPPONENT_SWITCH_APPROVAL:
			return { ...state, opponentSwitchApproval: action.payload };
		default:
			return state;
	}
};
