import {
	SIGN_IN,
	SIGN_OUT,
	UPDATE_BOARDSTATE,
	UPDATE_TICTAC_BOARDSTATE,
	TOGGLE_CURRENT_PLAYER,
	TOGGLE_CANPLAY,
	TOGGLE_TTT_CANPLAY,
	RESET_BOARDSTATE,
	RESET_TTT_BOARDSTATE,
	SET_WINNINGPLAYER,
	SET_ROOM,
	SET_USERS,
	SET_FIRSTPLAYER_NAME,
	SET_LASTPLAYED,
	SET_USERNAME,
	SET_CURRENT_PLAYER,
	SET_CURRENT_PLAYER_NAME,
	GET_PLAYER_PROFILE,
	CREATE_PLAYER_PROFILE,
	UPDATE_PLAYER_PROFILE,
	PROFILES_LOADING,
	CREATE_NEW_ROOM,
	UPDATE_ROOM_DATA,
	GET_ROOMS_LIST,
	DELETE_ROOM,
	ROOMS_LOADING,
	SET_CHANGE_GAME_MODAL_OPEN,
	SET_PLAYER_SWITCH_APPROVAL,
	SET_OPPONENT_SWITCH_APPROVAL,
	// UPDATE_GAME_ROOM,
} from './types';
// import streams from '../apis/api';
import history from '../history';
// import axios from 'axios';
import base from '../apis/api';

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
	if (newBoardstate.length === 7) {
		return {
			type: UPDATE_BOARDSTATE,
			payload: newBoardstate,
		};
	} else {
		return {
			type: UPDATE_BOARDSTATE,
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
	}
};
export const updateTicTacBoardstate = (newBoardstate) => {
	if (newBoardstate.length === 9) {
		return {
			type: UPDATE_TICTAC_BOARDSTATE,
			payload: newBoardstate,
		};
	} else {
		return {
			type: UPDATE_TICTAC_BOARDSTATE,
			payload: [0, 0, 0, 0, 0, 0, 0, 0, 0],
		};
	}
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
export const toggleTTTCanPlay = (canPlay) => {
	return {
		type: TOGGLE_TTT_CANPLAY,
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

// Actions regarding TicTacToe
export const resetTTTBoardState = () => {
	return {
		type: RESET_TTT_BOARDSTATE,
		payload: [0, 0, 0, 0, 0, 0, 0, 0, 0],
	};
};
// Actions Related to Sockets

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

export const setFirstplayerName = (firstPlayerName) => {
	return {
		type: SET_FIRSTPLAYER_NAME,
		payload: firstPlayerName,
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

// Actions concerning MongoDB

export const setProfilesLoading = () => {
	return {
		type: PROFILES_LOADING,
	};
};
export const getPlayerProfile = (id) => (dispatch) => {
	dispatch(setProfilesLoading());
	base.get(`/api/profiles/${id}`).then((res) =>
		dispatch({
			type: GET_PLAYER_PROFILE,
			payload: res.data,
		})
	);
};
export const createPlayerProfile = (profile) => (dispatch) => {
	base.post('/api/profiles', profile).then((res) =>
		dispatch({
			type: CREATE_PLAYER_PROFILE,
			payload: res.data,
		})
	);
	history.push('/');
};
export const updatePlayerProfile = (profile) => (dispatch) => {
	base.put(`/api/profiles/${profile._id}`, profile).then((res) =>
		dispatch({
			type: UPDATE_PLAYER_PROFILE,
			payload: res.data,
		})
	);
};

export const createRoomList = ({ room, roomId }) => (dispatch) => {
	base.post('/api/rooms', { name: room, roomId, numUsers: 1 }).then((res) => {
		dispatch({
			type: CREATE_NEW_ROOM,
			payload: res.data,
		});
	});
};
export const updateRoomData = (room) => (dispatch) => {
	// base.put(`/api/rooms/${room._id}`, room).then((res) =>
	base.put(`/api/rooms/${room.roomId}`, room).then((res) =>
		dispatch({
			type: UPDATE_ROOM_DATA,
			payload: res.data,
		})
	);
};

export const getRoomsList = () => (dispatch) => {
	dispatch(setRoomsLoading());
	base.get(`/api/rooms/`).then((res) => {
		console.log('res.data: ', res.data);
		dispatch({
			type: GET_ROOMS_LIST,
			payload: res.data,
		});
	});
};

export const deleteRoom = (id) => async (dispatch) => {
	await base.delete(`/api/rooms/${id}`);
	dispatch({ type: DELETE_ROOM, payload: id });
	// history.push('/');
};
export const setRoomsLoading = () => {
	return {
		type: ROOMS_LOADING,
	};
};

export const setChangeGameModalOpen = (val) => {
	return {
		type: SET_CHANGE_GAME_MODAL_OPEN,
		payload: val,
	};
};

export const setPlayerSwitchApproval = (val) => {
	return {
		type: SET_PLAYER_SWITCH_APPROVAL,
		payload: val,
	};
};
export const setOpponentSwitchApproval = (val) => {
	return {
		type: SET_OPPONENT_SWITCH_APPROVAL,
		payload: val,
	};
};
// export const updateGameRoom = (updatedRoomData) => (dispatch) => {
// 	base.put(`/api/rooms/${updatedRoomData.game}`, updatedRoomData).then((res) =>
// 		dispatch({
// 			type: UPDATE_GAME_ROOM,
// 			payload: res.data,
// 		})
// 	);
// };
