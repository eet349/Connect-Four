import {
	SIGN_IN,
	SIGN_OUT,
	UPDATE_BOARDSTATE,
	TOGGLE_CURRENT_PLAYER,
	TOGGLE_CANPLAY,
	RESET_BOARDSTATE,
	SET_WINNINGPLAYER,
	// JOIN_ROOM,
	// LEAVE_ROOM,
	SET_ROOM,
	SET_USERS,
	SET_FIRSTPLAYER,
	SET_LASTPLAYED,
	SET_USERNAME,
	SET_CURRENT_PLAYER,
	SET_CURRENT_PLAYER_NAME,
	// SET_I_INDEX,
	// SET_J_INDEX,
} from './types';
import streams from '../apis/api';
import history from '../history';

export const signIn = (userId) => {
	return {
		type: SIGN_IN,
		payload: userId,
	};
};

export const signOut = () => {
	return {
		type: SIGN_OUT,
	};
};
// actions related to connect four gameboard state

export const updateBoardstate = (newBoardstate) => {
	return {
		type: UPDATE_BOARDSTATE,
		payload: newBoardstate,
	};
};

export const toggleCurrentPlayer = (player) => {
	const newPlayer = player * -1;
	return {
		type: TOGGLE_CURRENT_PLAYER,
		payload: newPlayer,
	};
};
export const toggleCanPlay = (canPlay) => {
	return {
		type: TOGGLE_CANPLAY,
		payload: canPlay,
	};
};
export const setWinningPlayer = (winningPlayer) => {
	return {
		type: SET_WINNINGPLAYER,
		payload: winningPlayer,
	};
};
export const resetBoardState = () => {
	return {
		type: RESET_BOARDSTATE,
		payload: [
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
		],
	};
};

export const setRoom = (room) => {
	return {
		type: SET_ROOM,
		payload: room,
	};
};
export const setUsername = (userName) => {
	return {
		type: SET_USERNAME,
		payload: userName,
	};
};
export const setUsers = (users) => {
	return {
		type: SET_USERS,
		payload: users,
	};
};
// export const setI = (i) => {
// 	return {
// 		type: SET_I_INDEX,
// 		payload: i,
// 	};
// };
// export const setJ = (j) => {
// 	return {
// 		type: SET_J_INDEX,
// 		payload: j,
// 	};
// };

export const setFirstplayer = (firstPlayer) => {
	return {
		type: SET_FIRSTPLAYER,
		payload: firstPlayer,
	};
};
export const setLastPlayed = (newLastPlayed) => {
	return {
		type: SET_LASTPLAYED,
		payload: newLastPlayed,
	};
};
export const setCurrentPlayer = (currentPlayer) => {
	return {
		type: SET_CURRENT_PLAYER,
		payload: currentPlayer,
	};
};
export const setCurrentPlayerName = (currentPlayerName) => {
	return {
		type: SET_CURRENT_PLAYER_NAME,
		payload: currentPlayerName,
	};
};

// export const setServerCanPlay = (canPlay) => {
// 	return {
// 		type: SET_SERVER_CANPLAY,
// 		payload: canPlay,
// 	};
// };

// Actions Related to Sockets

// export const createStream = (formValues) => async (dispatch, getState) => {
//   const { userId } = getState().auth;
//   const response = await streams.post('/streams', { ...formValues, userId });
//   dispatch({ type: CREATE_STREAM, payload: response.data });
//   // do some programmatic navigation
//   history.push('/');
// };

// export const fetchStreams = () => async dispatch => {
//   const response = await streams.get('/streams');

//   dispatch({ type: FETCH_STREAMS, payload: response.data });
// };

// export const fetchStream = (id) => async dispatch => {
//   const response = await streams.get(`/streams/${id}`);

//   dispatch({ type: FETCH_STREAM, payload: response.data });
// };

// export const editStream = (id, formValues) => async dispatch => {
//   const response = await streams.patch(`/streams/${id}`, formValues);

//   dispatch({ type: EDIT_STREAM, payload: response.data });
//   history.push('/');
// }

// export const deleteStream = id => async dispatch => {
//   await streams.delete(`/streams/${id}`);
//   dispatch({ type: DELETE_STREAM, payload: id });
//   history.push('/');
// }
