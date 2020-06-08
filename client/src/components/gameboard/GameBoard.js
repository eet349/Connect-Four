import React from 'react';
import { withRouter } from 'react-router-dom';
import './gameboard.css';
import WinnerModal from '../WinnerModal';
import history from '../../history';
import { connect } from 'react-redux';
import {
	updateBoardstate,
	toggleCurrentPlayer,
	toggleCanPlay,
	resetBoardState,
	setWinningPlayer,
	setRoom,
	setUsername,
	setUsers,
	setFirstplayer,
	setLastPlayed,
	setCurrentPlayer,
	setCurrentPlayerName,
} from '../../actions';

import io from 'socket.io-client';

let socket;

const DEVENDPOINT = 'localhost:5000';
class GameBoard extends React.Component {
	componentDidMount() {
		socket = io(DEVENDPOINT);
		console.log('name: ', this.props.name);
		this.props.setUsername(this.props.name.trim().toLowerCase());
		socket.emit(
			'join',
			{ name: this.props.name, room: 'connect-four' },
			(error) => {
				if (error) {
					alert(error);
				}
			}
		);

		socket.on('roomData', (userData) => {
			const roomOccupancy = userData.roomOccupancy;
			this.props.setUsers(userData.users);
			this.props.setRoom(userData.room);
			this.props.setCurrentPlayer(userData.currentPlayer);
			this.props.setFirstplayer(userData.users[0].name);
			if (this.props.firstPlayer !== this.props.name.trim().toLowerCase()) {
				this.props.toggleCurrentPlayer(1);
			}
			this.props.setCurrentPlayerName(this.props.firstPlayer);
		});
	}
	componentDidUpdate() {
		socket.on('sentChip', (served) => {
			// this.props.setUsers(served.newUsers);
			// console.log('nextPlayer: ', served.nextPlayer);
			this.props.setCurrentPlayerName(served.nextPlayer.name);
			// console.log('currentPlayer: ', this.props.currentPlayer);
			this.props.setLastPlayed([served.i, served.j]);
			this.winCheck(served.value, served.i, served.j);
			this.props.updateBoardstate(served.newState);
		});
	}
	componentWillUnmount() {
		socket.emit('disconnect');
		socket.off();
	}

	resetBoard = () => {
		this.props.resetBoardState();
		this.props.toggleCurrentPlayer(-1);
		this.props.toggleCanPlay(true);
		this.props.setLastPlayed([-1, -1]);
	};

	winCheck = (value, i, j) => {
		if ((i && j) || (i === 0 && j) || (i && j === 0) || (i === 0 && j === 0)) {
			this.check(value, i, j);
			this.check(value, i, j);
			this.check(value, i, j);
		}
	};

	check = (value, i, j) => {
		// case 'vertical':
		this.elegantCheck(value, i, j, 0, -1);
		// case 'horizontal':
		this.elegantCheck(value, i, j, 1, 0);
		this.elegantCheck(value, i, j, -1, 0);
		// case 'diagonal':
		this.elegantCheck(value, i, j, 1, 1);
		this.elegantCheck(value, i, j, 1, -1);
		this.elegantCheck(value, i, j, -1, 1);
		this.elegantCheck(value, i, j, -1, -1);
	};

	elegantCheck = (value, i, j, g, h) => {
		const chipValue = value;
		var total = 0;

		for (let x = 0; x < 4; x++) {
			let next;
			if (i + x * g < 7 && j + x * h < 6 && i + x * g >= 0 && j + x * h >= 0) {
				next = this.props.boardState[i + x * g][j + x * h];
				if (next && next === chipValue) {
					total = total + chipValue;
					if (
						(total === 3 || total === -3) &&
						i - g >= 0 &&
						j - h >= 0 &&
						i - g < 7 &&
						j - h < 6 &&
						this.props.boardState[i - g][j - h] === chipValue
					) {
						this.endGame(chipValue);
					}
				}
			}
		}
		if (total === 4 || total === -4) {
			this.endGame(chipValue);
		}
	};

	endGame = (winner) => {
		// End game and stop from further moves and announce winner
		this.props.setWinningPlayer(winner);
		const winnerText = winner === 1 ? 'One' : 'Two';
		// console.log('Winner is Player ', winnerText);
		this.props.toggleCurrentPlayer(-1);
		this.props.toggleCanPlay(false);
	};

	getActualJIndex = (arr) => {
		var newArr = arr.filter((el) => el === 1 || el === -1);
		return newArr.length >= 5 ? 5 : newArr.length;
	};
	playChip = (value, i, j, newState) => {
		socket.emit('playChip', {
			value,
			player: this.props.name.trim().toLowerCase(),
			i: i,
			j: j,
			newState,
		});
	};

	onPlayerClick = (i, j) => {
		const newState = this.props.boardState;
		var played = false;
		var actualJIndex = this.getActualJIndex(this.props.boardState[i]);
		var playedI;
		var playedJ;
		const value =
			this.props.firstPlayer === this.props.name.trim().toLowerCase() ? 1 : -1;
		if (this.props.canPlay) {
			const newColumn = this.props.boardState[i].map((elm, ind, array) => {
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
		this.playChip(value, playedI, playedJ, newState);
	};

	renderBoard = () => {
		const newOuterArray = this.props.boardState.map((columnArray, i) => {
			const newInnerArray = columnArray.map((innerElement, j, innerArray) => {
				var chipColor = 'Unplayed';
				if (innerElement === 1) {
					chipColor = 'PlayedP1';
				} else if (innerElement === -1) {
					chipColor = 'PlayedP2';
				}
				var lastPlayed =
					i === this.props.lastPlayed[0] && j === this.props.lastPlayed[1]
						? 'lastPlayed'
						: 'notLastPlayed';

				return (
					<div
						id='chipBox'
						className={`ConnectFourBox ${lastPlayed}`}
						key={`${(i, j)}`}
						onClick={() =>
							// this.props.users[0].name === this.props.userName
							this.props.currentPlayerName === this.props.userName
								? // || this.props.firstPlayer === this.props.userName
								  this.onPlayerClick(i, j)
								: console.log(
										'not your turn',
										this.props.userName,
										this.props.currentPlayerName
								  )
						}
					>
						<div className={`${chipColor} Chip`}></div>
					</div>
				);
			});
			return newInnerArray;
		});
		return newOuterArray;
	};

	renderActions = () => {
		return (
			<React.Fragment>
				<button
					onClick={() => {
						this.resetBoard();
						this.props.toggleCanPlay(true);
					}}
					className='ui button primary'
				>
					New Game
				</button>
				{/* <Link to={"/"} className="ui button">Cancel</Link> */}
			</React.Fragment>
		);
	};

	renderContent = () => {
		const winnerText =
			'Winner is Player ' + (this.props.winningPlayer === 1 ? 'One' : 'Two');
		if (!this.props.canPlay) {
			return (
				<>
					{this.renderBoard()}
					<WinnerModal
						title='Winner!'
						actions={this.renderActions()}
						//
						onDismiss={() => history.push('/')}
						winner={winnerText}
					/>
				</>
			);
		}
		return this.renderBoard();
	};
	render() {
		return (
			<div id='board' className='ui grid gameBoard'>
				{this.renderContent()}
				<div>
					{/* <button className='ui button primary' onClick={this.resetBoard}>
						Reset Game
					</button> */}
					{/* <Chat /> */}
				</div>
			</div>
		);
	}
}

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
		firstPlayer: state.socket.firstPlayer,
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
		setFirstplayer,
		setLastPlayed,
		setCurrentPlayer,
		setCurrentPlayerName,
	})(GameBoard)
);
// will be incharge of rendering the gameboard and the game logic
