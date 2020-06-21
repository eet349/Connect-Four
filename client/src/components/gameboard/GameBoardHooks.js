import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import './gameboard.css';
import WinnerModal from '../WinnerModal';
import queryString from 'query-string';
import history from '../../history';
import { useDispatch, useSelector } from 'react-redux';
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

const GameBoardHooks = (props) => {
	const [value, setValue] = useState(null);
	const [i, setI] = useState(null);
	const [j, setJ] = useState(null);
	const dispatch = useDispatch();
	const boardState = useSelector((state) => state.connectFour.boardState);
	const currentPlayerName = useSelector(
		(state) => state.connectFour.currentPlayerName
	);
	const canPlay = useSelector((state) => state.connectFour.canPlay);
	const winningPlayer = useSelector((state) => state.connectFour.winningPlayer);
	const userName = useSelector((state) => state.socket.userName);
	const lastPlayedArr = useSelector((state) => state.connectFour.lastPlayed);
	const firstPlayerName = useSelector((state) => state.socket.firstPlayer);
	// const socketRoom = useSelector((state) => state.socket.userRoom);

	useEffect(() => {
		const { name, room } = queryString.parse(props.match.params.name);

		dispatch(setUsername(name.trim().toLowerCase()));
		dispatch(setRoom(room));
		props.socket.emit(
			'join',
			{ name: name.trim().toLowerCase(), room },
			(error) => {
				if (error) {
					alert(error);
				}
			}
		);
		props.socket.on('roomData', (userData) => {
			const roomOccupancy = userData.roomOccupancy;
			dispatch(setUsers(userData.users));
			dispatch(setRoom(userData.room));
			dispatch(setCurrentPlayer(userData.currentPlayer));
			dispatch(setFirstplayerName(userData.users[0].name));

			if (
				userData.users[0].name !== props.match.params.name.trim().toLowerCase()
			) {
				dispatch(toggleCurrentPlayer(1));
			}
			dispatch(setCurrentPlayerName(userData.users[0].name));
		});
		return () => {
			props.socket.emit('disconnect');
			props.socket.off();
		};
	}, [props.location.search]);

	useEffect(() => {
		props.socket.on('sentChip', (served) => {
			dispatch(setCurrentPlayerName(served.nextPlayer.name));
			dispatch(setLastPlayed([served.i, served.j]));
			dispatch(updateBoardstate(served.newState));
			setValue(served.value);
			setI(served.i);
			setJ(served.j);
		});
		return () => {
			props.socket.emit('disconnect');
			// props.socket.off();
		};
	}, [boardState]);

	useEffect(() => {
		winCheck(value, i, j);
	});

	const resetBoard = () => {
		dispatch(resetBoardState());
		dispatch(toggleCurrentPlayer(-1));
		dispatch(toggleCanPlay(true));
		dispatch(setLastPlayed([-1, -1]));
	};

	const winCheck = (value, i, j) => {
		if ((i && j) || (i === 0 && j) || (i && j === 0) || (i === 0 && j === 0)) {
			check(value, i, j);
		}
	};

	const check = (value, i, j) => {
		// case 'vertical':
		elegantCheck(value, i, j, 0, -1);
		// case 'horizontal':
		elegantCheck(value, i, j, 1, 0);
		elegantCheck(value, i, j, -1, 0);
		// case 'diagonal':
		elegantCheck(value, i, j, 1, 1);
		elegantCheck(value, i, j, 1, -1);
		elegantCheck(value, i, j, -1, 1);
		elegantCheck(value, i, j, -1, -1);
	};

	const elegantCheck = (value, i, j, g, h) => {
		const chipValue = value;
		var total = 0;
		// console.log('chipvalue: ', chipValue);
		for (let x = 0; x < 4; x++) {
			let next;
			if (i + x * g < 7 && j + x * h < 6 && i + x * g >= 0 && j + x * h >= 0) {
				next = boardState[i + x * g][j + x * h];
				// console.log('boardState in elegantCheck: ', boardState);
				if (next && next === chipValue) {
					// console.log('total b4 adding: ', total);
					total = total + chipValue;
					// console.log('total after adding: ', total);
					if (
						(total === 3 || total === -3) &&
						i - g >= 0 &&
						j - h >= 0 &&
						i - g < 7 &&
						j - h < 6 &&
						boardState[i - g][j - h] === chipValue
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
		// const winnerText = winner === 1 ? 'One' : 'Two';
		// console.log('Winner is Player ', winnerText);
		dispatch(setWinningPlayer(winner));
		dispatch(toggleCurrentPlayer(-1));
		dispatch(toggleCanPlay(false));
	};

	const getActualJIndex = (arr) => {
		var newArr = arr.filter((el) => el === 1 || el === -1);
		return newArr.length >= 5 ? 5 : newArr.length;
	};
	const playChip = (value, i, j, newState) => {
		props.socket.emit('playChip', {
			value,
			player: userName,
			i: i,
			j: j,
			newState,
		});
	};

	const onPlayerClick = (i, j) => {
		const newState = boardState;
		var played = false;
		var actualJIndex = getActualJIndex(boardState[i]);
		var playedI;
		var playedJ;
		const value = firstPlayerName === userName ? 1 : -1;
		if (canPlay) {
			const newColumn = boardState[i].map((elm, ind, array) => {
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
		const newOuterArray = boardState.map((columnArray, i) => {
			const newInnerArray = columnArray.map((innerElement, j) => {
				var chipColor = 'Unplayed';
				if (innerElement === 1) {
					chipColor = 'PlayedP1';
				} else if (innerElement === -1) {
					chipColor = 'PlayedP2';
				}
				var lastPlayed =
					i === lastPlayedArr[0] && j === lastPlayedArr[1]
						? 'lastPlayed'
						: 'notLastPlayed';

				return (
					<div
						id='chipBox'
						className={`ConnectFourBox`}
						key={`${(i, j)}`}
						onClick={() =>
							currentPlayerName === userName
								? onPlayerClick(i, j)
								: console.log('not your turn', currentPlayerName, userName)
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
						toggleCanPlay(true);
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
			'Winner is Player ' + (winningPlayer === 1 ? 'One' : 'Two');
		if (!canPlay) {
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
		</div>
	);
};

export default withRouter(GameBoardHooks);
// will be incharge of rendering the gameboard and the game logic
