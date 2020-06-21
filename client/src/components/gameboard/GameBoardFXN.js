import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import './gameboard.css';
import WinnerModal from '../WinnerModal';
import history from '../../history';
import { connect, useDispatch } from 'react-redux';
import {
	updateBoardstate,
	toggleCurrentPlayer,
	toggleCanPlay,
	resetBoardState,
	setWinningPlayer,
	setRoom,
	setUsername,
	setUsers,
	setFirstplayerName,
	setLastPlayed,
	setCurrentPlayer,
	setCurrentPlayerName,
} from '../../actions';

import io from 'socket.io-client';

let socket;

const DEVENDPOINT = 'localhost:5000';
const GameBoardFXN = (props) => {
	// const [played, setPlayed] = useState([false]);
	const [playerName, setPlayerName] = useState('');
	const [firstPlayerName, setFirstPlayerName] = useState('');
	const [currentPlayerName, setCurrentPlayerName] = useState('');
	useEffect(() => {
		// const dispatch = useDispatch();
		socket = io(DEVENDPOINT);
		// console.log('name: ', props);
		props.setUsername(props.name.trim().toLowerCase());
		setPlayerName(props.name.trim().toLowerCase());
		socket.emit('join', { name: props.name, room: 'connect-four' }, (error) => {
			if (error) {
				alert(error);
			}
		});
		socket.on('roomData', (userData) => {
			const roomOccupancy = userData.roomOccupancy;
			props.setUsers(userData.users);
			props.setRoom(userData.room);
			props.setCurrentPlayer(userData.currentPlayer);
			setFirstPlayerName(userData.users[0].name);
			// console.log('firstPlayerName: ', firstPlayerName, userData.users[0].name);
			props.setFirstplayerName(userData.users[0].name);
			// console.log('props: ', props);

			// console.log(
			// 	'first player: ',
			// 	userData.users[0].name,
			// 	props.name.trim().toLowerCase(),
			// 	userData.users[0].name !== props.name.trim().toLowerCase()
			// );
			// if (props.firstPlayerName !== props.name.trim().toLowerCase()) {
			// if (firstPlayerName !== props.name.trim().toLowerCase()) {
			if (userData.users[0].name !== props.name.trim().toLowerCase()) {
				props.toggleCurrentPlayer(1);
			}
			// props.setCurrentPlayerName(props.firstPlayerName);
			props.setCurrentPlayerName(userData.users[0].name);
			setCurrentPlayerName(firstPlayerName);
		});
		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	}, [DEVENDPOINT, props.location.search]);

	const dispatch = useDispatch();
	useEffect(() => {
		socket.on('sentChip', (served) => {
			// console.log('served.nextPlayer.name: ', served.nextPlayer.name);
			// props.setCurrentPlayerName(currentPlayerName);
			props.setCurrentPlayerName(served.nextPlayer.name);
			props.setLastPlayed([served.i, served.j]);
			winCheck(served.value, served.i, served.j);
			console.log('newstate: ', served.newState);
			dispatch(props.updateBoardstate(served.newState));
		});
		// setPlayed((sdf) => [...sdf, false]);
	}, []);

	const resetBoard = () => {
		props.resetBoardState();
		props.toggleCurrentPlayer(-1);
		props.toggleCanPlay(true);
		props.setLastPlayed([-1, -1]);
	};

	const winCheck = (value, i, j) => {
		if ((i && j) || (i === 0 && j) || (i && j === 0) || (i === 0 && j === 0)) {
			check(value, i, j);
			// check(value, i, j);
			// check(value, i, j);
		}
	};

	const check = (value, i, j) => {
		// case 'vertical':
		elegantCheck(value, i, j, 0, -1);
		// case 'horizontal':
		// elegantCheck(value, i, j, 1, 0);
		// elegantCheck(value, i, j, -1, 0);
		// // case 'diagonal':
		// elegantCheck(value, i, j, 1, 1);
		// elegantCheck(value, i, j, 1, -1);
		// elegantCheck(value, i, j, -1, 1);
		// elegantCheck(value, i, j, -1, -1);
	};

	const elegantCheck = (value, i, j, g, h) => {
		const chipValue = value;
		// var total = chipValue;
		var total = 0;
		console.log('chipvalue: ', chipValue);
		for (let x = 0; x < 4; x++) {
			let next;
			if (i + x * g < 7 && j + x * h < 6 && i + x * g >= 0 && j + x * h >= 0) {
				next = props.boardState[i + x * g][j + x * h];
				console.log('next: ', next, props);
				if (next && next === chipValue) {
					console.log('total b4 adding: ', total);
					total = total + chipValue;
					console.log('total after adding: ', total);
					if (
						(total === 3 || total === -3) &&
						i - g >= 0 &&
						j - h >= 0 &&
						i - g < 7 &&
						j - h < 6 &&
						props.boardState[i - g][j - h] === chipValue
					) {
						endGame(chipValue);
					}
				}
			}
		}
		if (total === 4 || total === -4) {
			endGame(chipValue);
		}
	};

	const endGame = (winner) => {
		// End game and stop from further moves and announce winner
		props.setWinningPlayer(winner);
		const winnerText = winner === 1 ? 'One' : 'Two';
		// console.log('Winner is Player ', winnerText);
		props.toggleCurrentPlayer(-1);
		props.toggleCanPlay(false);
	};

	const getActualJIndex = (arr) => {
		var newArr = arr.filter((el) => el === 1 || el === -1);
		return newArr.length >= 5 ? 5 : newArr.length;
	};
	const playChip = (value, i, j, newState) => {
		socket.emit('playChip', {
			value,
			player: props.name.trim().toLowerCase(),
			i: i,
			j: j,
			newState,
		});
	};

	const onPlayerClick = (i, j) => {
		// setPlayed(true);
		const newState = props.boardState;
		var played = false;
		var actualJIndex = getActualJIndex(props.boardState[i]);
		var playedI;
		var playedJ;
		const value =
			props.firstPlayerName === props.name.trim().toLowerCase() ? 1 : -1;
		if (props.canPlay) {
			const newColumn = props.boardState[i].map((elm, ind, array) => {
				if (elm === 1) {
					if (array[ind + 1] === 0) {
						playedI = i;
						playedJ = actualJIndex;
					}
					return elm;
				} else if (elm === -1) {
					if (array[ind + 1] === 0) {
						playedI = i;
						playedJ = actualJIndex;
					}
					return elm;
				} else if (elm === 0 && !played) {
					if (array[ind + 1] === 0) {
						playedI = i;
						playedJ = actualJIndex;
					}
					played = true;
					return value;
				} else {
					return 0;
				}
			});
			newState[i] = newColumn;
		}
		playChip(value, playedI, playedJ, newState);
	};

	const renderBoard = () => {
		const newOuterArray = props.boardState.map((columnArray, i) => {
			const newInnerArray = columnArray.map((innerElement, j, innerArray) => {
				var chipColor = 'Unplayed';
				if (innerElement === 1) {
					chipColor = 'PlayedP1';
				} else if (innerElement === -1) {
					chipColor = 'PlayedP2';
				}
				var lastPlayed =
					i === props.lastPlayed[0] && j === props.lastPlayed[1]
						? 'lastPlayed'
						: 'notLastPlayed';

				return (
					<div
						id='chipBox'
						// className={`ConnectFourBox ${lastPlayed}`}
						className={`ConnectFourBox`}
						key={`${(i, j)}`}
						onClick={() =>
							// this.props.users[0].name === this.props.userName
							props.currentPlayerName === props.userName
								? // || this.props.firstPlayer === this.props.userName
								  onPlayerClick(i, j)
								: console.log(
										'not your turn',
										props.currentPlayerName,
										props.userName
								  )
						}
					>
						<div className={`${chipColor} Chip ${lastPlayed}`}></div>
					</div>
				);
			});
			return newInnerArray;
		});
		return newOuterArray;
	};

	const renderActions = () => {
		return (
			<React.Fragment>
				<button
					onClick={() => {
						resetBoard();
						props.toggleCanPlay(true);
					}}
					className='ui button primary'
				>
					New Game
				</button>
				{/* <Link to={"/"} className="ui button">Cancel</Link> */}
			</React.Fragment>
		);
	};

	const renderContent = () => {
		const winnerText =
			'Winner is Player ' + (props.winningPlayer === 1 ? 'One' : 'Two');
		if (!props.canPlay) {
			return (
				<>
					{renderBoard()}
					<WinnerModal
						title='Winner!'
						actions={renderActions()}
						//
						onDismiss={() => history.push('/')}
						winner={winnerText}
					/>
				</>
			);
		}
		return renderBoard();
	};

	return (
		<div id='board' className='ui grid gameBoard'>
			{renderContent()}
			<div>
				{/* <button className='ui button primary' onClick={this.resetBoard}>
						Reset Game
					</button> */}
				{/* <Chat /> */}
			</div>
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	return {
		boardState: state.connectFour.boardState,
		currentPlayer: state.connectFour.currentPlayer,
		currentPlayerName: state.connectFour.currentPlayerName,
		canPlay: state.connectFour.canPlay,
		winningPlayer: state.connectFour.winningPlayer,
		lastPlayed: state.connectFour.lastPlayed,
		userId: state.auth.userId,
		name: ownProps.match.params.name,
		userName: state.socket.userName,
		users: state.socket.users,
		room: state.socket.userRoom,
		firstPlayerName: state.socket.firstPlayer,
		realCurrentPlayer: state.socket.currentPlayer,
	};
};

export default withRouter(
	connect(mapStateToProps, {
		updateBoardstate,
		toggleCurrentPlayer,
		toggleCanPlay,
		resetBoardState,
		setWinningPlayer,
		setRoom,
		setUsername,
		setUsers,
		setFirstplayerName,
		setLastPlayed,
		setCurrentPlayer,
		setCurrentPlayerName,
	})(GameBoardFXN)
);
// will be incharge of rendering the gameboard and the game logic
