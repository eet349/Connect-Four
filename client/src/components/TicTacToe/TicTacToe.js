// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import queryString from 'query-string';
// import {
// 	resetTTTBoardState,
// 	updateBoardstate,
// 	toggleCurrentPlayer,
// 	setRoom,
// 	setUsers,
// 	setUsername,
// 	setLastPlayed,
// 	setCurrentPlayer,
// 	setFirstplayerName,
// 	setCurrentPlayerName,
// } from '../../actions';
// import PlayerNamePlates from '../gameboard/PlayerNameplates';
// import Chat from '../Chat/Chat';
// import './TicTacToe.css';
// // import io from 'socket.io-client';
// // const DEVENDPOINT = 'localhost:5000';

// const TicTacToe = (props) => {
// 	// const socket = io(DEVENDPOINT);
// 	const [index, setIndex] = useState(null);
// 	const [value, setValue] = useState(null);
// 	const dispatch = useDispatch();
// 	const boardState = useSelector((state) => state.tictactoe.boardState);
// 	const canPlay = useSelector((state) => state.tictactoe.canPlay);
// 	const userName = useSelector((state) => state.socket.userName);
// 	const firstPlayerName = useSelector((state) => state.socket.firstPlayer);
// 	const currentPlayerName = useSelector((state) => state.socket.currentPlayer);
// 	const [localBoardState, setLocalBoardState] = useState([
// 		0,
// 		0,
// 		0,
// 		0,
// 		0,
// 		0,
// 		0,
// 		0,
// 		0,
// 	]);
// 	useEffect(() => {
// 		const { name, room } = queryString.parse(props.location.search);
// 		// const { name, room } = queryString.parse(props.match.params.name);
// 		// console.log('props: ', props.location, name, room);
// 		dispatch(setUsername(name.trim().toLowerCase()));
// 		dispatch(setRoom(room));
// 		props.socket.emit(
// 			'join',
// 			{ name: name.trim().toLowerCase(), room },
// 			(error) => {
// 				if (error) {
// 					alert(error);
// 				}
// 			}
// 		);
// 		props.socket.on('roomData', (userData) => {
// 			const roomOccupancy = userData.roomOccupancy;
// 			dispatch(setRoom(userData.room));
// 			dispatch(setUsers(userData.users));
// 			dispatch(setCurrentPlayer(userData.currentPlayer));
// 			dispatch(setFirstplayerName(userData.users[0].name));

// 			if (
// 				userData.users[0].name !== name.trim().toLowerCase()
// 				// userData.users[0].name !== userName
// 				// userData.users[0].name !== props.match.params.name.trim().toLowerCase()
// 			) {
// 				dispatch(toggleCurrentPlayer(1));
// 			}
// 			dispatch(setCurrentPlayerName(userData.users[0].name));
// 		});
// 		return () => {
// 			props.socket.emit('disconnect');
// 			props.socket.off();
// 		};
// 	}, [props.location.search, props.socket]);
// 	// }, [props.location.search]);

// 	useEffect(() => {
// 		props.socket.on('sentTic', (served) => {
// 			dispatch(setCurrentPlayerName(served.nextPlayer.name));
// 			dispatch(setLastPlayed([served.index]));
// 			dispatch(updateBoardstate(served.newState));
// 			setValue(served.value);
// 			setIndex(served.i); //make a setIndex
// 		});
// 		return () => {
// 			props.socket.emit('disconnect');
// 			// socket.off();
// 		};
// 	}, [boardState]);

// 	useEffect(() => {
// 		winCheck(value, index);
// 	});

// 	const winCheck = (value, index) => {
// 		const ticValue = value;
// 		const zeroArray = [
// 			[0, 1, 2],
// 			[0, 3, 6],
// 			[0, 4, 8],
// 		];
// 		const oneArray = [
// 			[0, 1, 2],
// 			[1, 4, 7],
// 		];
// 		const twoArray = [
// 			[0, 1, 2],
// 			[2, 5, 8],
// 			[2, 4, 6],
// 		];
// 		const threeArray = [
// 			[3, 4, 5],
// 			[0, 3, 6],
// 		];
// 		const fourArray = [
// 			[3, 4, 5],
// 			[1, 4, 7],
// 			[0, 4, 8],
// 			[2, 4, 6],
// 		];
// 		const fiveArray = [
// 			[3, 4, 5],
// 			[2, 5, 8],
// 		];
// 		const sixArray = [
// 			[6, 7, 8],
// 			[0, 3, 6],
// 			[2, 4, 6],
// 		];
// 		const sevenArray = [
// 			[6, 7, 8],
// 			[1, 4, 7],
// 		];
// 		const eightArray = [
// 			[6, 7, 8],
// 			[2, 5, 8],
// 			[0, 4, 8],
// 		];

// 		switch (index) {
// 			case 0:
// 				check(ticValue, index, zeroArray);
// 			case 1:
// 				check(ticValue, index, oneArray);
// 			case 2:
// 				check(ticValue, index, twoArray);
// 			case 3:
// 				check(ticValue, index, threeArray);
// 			case 4:
// 				check(ticValue, index, fourArray);
// 			case 5:
// 				check(ticValue, index, fiveArray);
// 			case 6:
// 				check(ticValue, index, sixArray);
// 			case 7:
// 				check(ticValue, index, sevenArray);
// 			case 8:
// 				check(ticValue, index, eightArray);
// 		}
// 	};

// 	const check = (value, index, arr) => {
// 		arr.forEach((el, ind) => {
// 			const total = el.reduce((total, currentVal) => {
// 				return total + boardState[currentVal];
// 			}, boardState[el[0]]);
// 			console.log('total: ', total);
// 			if (total === 3 || total === -3) {
// 				endGame(value);
// 			}
// 		});
// 	};
// 	const endGame = (val) => {
// 		console.log('the winner is ', val);
// 		dispatch(resetTTTBoardState());
// 	};
// 	const handleClick = (index) => {
// 		console.log('click handled: ', index);
// 		const newState = boardState;
// 		var played = false;
// 		const player = userName;
// 		var playedIndex;
// 		const value = firstPlayerName === userName ? 1 : -1;
// 		var newBoardState = boardState;
// 		console.log('canplay: ');
// 		if (canPlay) {
// 			newBoardState = newBoardState.splice(index, 1, value);
// 			setLocalBoardState(newBoardState);
// 			dispatch(updateBoardstate(newBoardState));
// 		}
// 		console.log('hi');
// 		console.log(
// 			'playtic: value, player, index, newState ',
// 			value,
// 			player,
// 			index,
// 			newBoardState
// 		);
// 		props.socket.emit('playTic', { value, player, index, newState });
// 	};

// 	const renderTicTacToeBoard = () => {
// 		const mappedBoardState = localBoardState.map((elm, index) => {
// 			var t = index >= 3 ? 'T ' : '';
// 			var b = index < 6 ? 'B ' : '';
// 			var r =
// 				index < 2 || (index > 2 && index < 5) || (index > 5 && index < 8)
// 					? 'R '
// 					: '';
// 			var l =
// 				(index > 0 && index < 3) ||
// 				(index > 3 && index < 6) ||
// 				(index > 6 && index < 9)
// 					? 'L '
// 					: '';
// 			var classText = t + b + r + l;

// 			return (
// 				<div
// 					key={index}
// 					className={`${classText}box`}
// 					onClick={() => {
// 						currentPlayerName.name === userName
// 							? handleClick(index)
// 							: console.log('Not of your turn ', currentPlayerName);
// 					}}
// 				></div>
// 			);
// 		});
// 		return mappedBoardState;
// 	};
// 	return (
// 		<div className=''>
// 			{/* <PlayerNamePlates /> */}
// 			<div className='boardContainer'>{renderTicTacToeBoard()}</div>
// 			{/* <Chat socket={socket} /> */}
// 		</div>
// 	);
// };

// export default TicTacToe;
