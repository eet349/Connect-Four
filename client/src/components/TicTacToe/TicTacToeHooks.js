import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import history from '../../history';
import WinnerModal from '../WinnerModal';

import {
	resetTTTBoardState,
	updateTicTacBoardstate,
	toggleCurrentPlayer,
	toggleTTTCanPlay,
	setRoom,
	setUsers,
	setUsername,
	setLastPlayed,
	setCurrentPlayer,
	setFirstplayerName,
	setCurrentPlayerName,
	setWinningPlayer,
} from '../../actions';
import './TicTacToe.css';

const TicTacToe = (props) => {
	const [index, setIndex] = useState(null);
	const [value, setValue] = useState(null);
	// const [hideChat, setHideChat] = useState(false);
	const dispatch = useDispatch();
	const ticTacBoardState = useSelector(
		(state) => state.tictactoe.ticTacBoardState
	);
	const canPlay = useSelector((state) => state.tictactoe.canPlay);
	const userName = useSelector((state) => state.socket.userName);
	const firstPlayerName = useSelector((state) => state.socket.firstPlayer);
	const currentPlayerName = useSelector(
		(state) => state.tictactoe.currentPlayerName
	);
	const winningPlayer = useSelector((state) => state.tictactoe.winningPlayer);
	const users = useSelector((state) => state.socket.users);
	const userRoom = useSelector((state) => state.socket.userRoom);
	const [localBoardState, setLocalBoardState] = useState([
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
	]);
	useEffect(() => {
		const { name, room, game, switchGame } = queryString.parse(
			props.location.search
		);
		dispatch(setUsername(name.trim().toLowerCase()));
		dispatch(setRoom(room));

		if (switchGame) {
			resetBoard();
		}

		props.socket.on('roomData', (userData) => {
			console.log('roomData: ', userData);
			dispatch(setRoom(userData.room));
			dispatch(setUsers(userData.users));
			dispatch(setCurrentPlayer(userData.currentPlayer));
			dispatch(setFirstplayerName(userData.users[0].name));

			if (userData.users[0].name !== userName) {
				dispatch(toggleCurrentPlayer(1));
			}
			dispatch(setCurrentPlayerName(userData.users[0].name));
		});
		return () => {
			props.socket.off();
		};
	}, [props.location.search]);

	useEffect(() => {
		props.socket.on('sentTic', (served) => {
			dispatch(setCurrentPlayerName(served.nextPlayer.name));
			dispatch(setLastPlayed([served.index]));
			dispatch(updateTicTacBoardstate(served.newState));
			setLocalBoardState(served.newState);
			setValue(served.value);
			setIndex(served.index); //make a setIndex
		});
		return () => {};
	}, [ticTacBoardState]);

	useEffect(() => {
		winCheck(value, index);
	});

	const winCheck = (value, index) => {
		const ticValue = value;
		const zeroArray = [
			[0, 1, 2],
			[0, 3, 6],
			[0, 4, 8],
		];
		const oneArray = [
			[0, 1, 2],
			[1, 4, 7],
		];
		const twoArray = [
			[0, 1, 2],
			[2, 5, 8],
			[2, 4, 6],
		];
		const threeArray = [
			[3, 4, 5],
			[0, 3, 6],
		];
		const fourArray = [
			[3, 4, 5],
			[1, 4, 7],
			[0, 4, 8],
			[2, 4, 6],
		];
		const fiveArray = [
			[3, 4, 5],
			[2, 5, 8],
		];
		const sixArray = [
			[6, 7, 8],
			[0, 3, 6],
			[2, 4, 6],
		];
		const sevenArray = [
			[6, 7, 8],
			[1, 4, 7],
		];
		const eightArray = [
			[6, 7, 8],
			[2, 5, 8],
			[0, 4, 8],
		];

		switch (index) {
			case 0:
				check(ticValue, index, zeroArray);
				break;
			case 1:
				check(ticValue, index, oneArray);
				break;
			case 2:
				check(ticValue, index, twoArray);
				break;
			case 3:
				check(ticValue, index, threeArray);
				break;
			case 4:
				check(ticValue, index, fourArray);
				break;
			case 5:
				check(ticValue, index, fiveArray);
				break;
			case 6:
				check(ticValue, index, sixArray);
				break;
			case 7:
				check(ticValue, index, sevenArray);
				break;
			case 8:
				check(ticValue, index, eightArray);
				break;
		}
		checkDraw();
	};

	const check = (value, index, arr) => {
		arr.forEach((el, ind) => {
			const total = el.reduce((total, currentVal) => {
				return total + ticTacBoardState[currentVal];
			}, 0);
			if (total === 3 || total === -3) {
				endGame(value);
			}
		});
	};
	const checkDraw = () => {
		const drawCheckArr = ticTacBoardState.filter(
			(elm) => elm === 1 || elm === -1
		);

		if (
			drawCheckArr.length === 9 &&
			(winningPlayer !== 1 || winningPlayer !== -1)
		) {
			if (!winningPlayer) {
				endGame(0);
			}
		}
	};

	const endGame = (val) => {
		dispatch(setWinningPlayer(val));
		dispatch(resetTTTBoardState());
		dispatch(toggleTTTCanPlay(false));
	};

	const resetBoard = () => {
		dispatch(resetTTTBoardState());
		dispatch(toggleCurrentPlayer(-1));
		dispatch(toggleTTTCanPlay(true));
		dispatch(setLastPlayed([-1]));
		dispatch(setWinningPlayer(null));
		setLocalBoardState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
	};

	const handleClick = (index) => {
		var newState = ticTacBoardState;
		const player = userName;
		const value = firstPlayerName === userName ? 1 : -1;

		if (canPlay) {
			if (ticTacBoardState[index] === 0) {
				newState.splice(index, 1, value);
			}
			dispatch(updateTicTacBoardstate(newState));
			setLocalBoardState(newState);
			props.socket.emit('playTic', {
				value,
				player,
				index,
				newState,
				room: userRoom,
			});
		}
	};

	const renderTicTacToeBoard = () => {
		const mappedBoardState = localBoardState.map((elm, index) => {
			var t = index >= 3 ? 'T ' : '';
			var b = index < 6 ? 'B ' : '';
			var r =
				index < 2 || (index > 2 && index < 5) || (index > 5 && index < 8)
					? 'R '
					: '';
			var l =
				(index > 0 && index < 3) ||
				(index > 3 && index < 6) ||
				(index > 6 && index < 9)
					? 'L '
					: '';
			var classText = t + b + r + l;
			var ticOrTac = '';
			if (elm === 1) {
				ticOrTac = 'X';
			} else if (elm === -1) {
				ticOrTac = 'O';
			}

			return (
				<div
					key={index}
					className={`${classText}box ${ticOrTac}`}
					onClick={() => {
						currentPlayerName === userName
							? users.length > 1
								? handleClick(index)
								: alert('Please wait until a second player has joined the room')
							: alert('Not of your turn ', currentPlayerName, userName);
					}}
				></div>
			);
		});
		return mappedBoardState;
	};

	const renderActions = () => {
		return (
			<React.Fragment>
				<button
					onClick={() => {
						resetBoard();
						toggleTTTCanPlay(true);
					}}
					className='ui button primary'
				>
					New Game
				</button>
			</React.Fragment>
		);
	};
	const renderContent = () => {
		var winnerText;
		if (winningPlayer === 0) {
			winnerText = 'Draw!';
		} else if (winningPlayer === 1 || winningPlayer === -1) {
			winnerText = `Winner is Player ${
				winningPlayer === 1 ? users[0].name : users[1].name
			}`;
		}
		if (!canPlay) {
			return (
				<>
					{renderTicTacToeBoard()}
					<WinnerModal
						title='Winner!'
						actions={renderActions()}
						onDismiss={() => history.push('/')}
						winner={winnerText}
					/>
				</>
			);
		}
		return renderTicTacToeBoard();
	};

	return (
		<>
			<div className='boardContainer'>{renderContent()}</div>
		</>
	);
};

export default withRouter(TicTacToe);
