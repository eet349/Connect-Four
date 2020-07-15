import React from 'react';
import GameBoardHooks from '../gameboard/GameBoardHooks';
import TicTacToe from '../TicTacToe/TicTacToeHooks';
import RockPaperScissors from '../RockPaperScissors/RockPaperScissors';
import Chat from '../Chat/Chat';
import PlayerNameplates from '../gameboard/PlayerNameplates';
import './GameRoom.css';
import io from 'socket.io-client';
import queryString from 'query-string';
const DEVENDPOINT = 'localhost:5000';

const GameRoom = (props) => {
	const socket = io(DEVENDPOINT);
	let styles = {
		width: '100%',
	};
	const { name, room, game } = queryString.parse(props.location.search);
	console.log('props.location.search: ', props.location.search);
	const renderGame = () => {
		if (game === 'tic-tac-toe') {
			return (
				<React.Fragment>
					<TicTacToe socket={socket} />
				</React.Fragment>
			);
		} else if (game === 'connect-four') {
			return (
				<React.Fragment>
					<GameBoardHooks socket={socket} />
				</React.Fragment>
			);
		} else if (game === 'rock-paper-scissors') {
			return (
				<React.Fragment>
					<RockPaperScissors socket={socket} />
				</React.Fragment>
			);
		}
	};
	return (
		<div className='ui container'>
			<div className='ui center' styles={styles}>
				<PlayerNameplates game={game} />
				<div className='flexContainer'>
					<div>{renderGame()}</div>
					<div>
						<Chat socket={socket} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default GameRoom;
