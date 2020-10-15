import React, { useEffect } from 'react';
import GameBoardHooks from '../gameboard/GameBoardHooks';
import TicTacToe from '../TicTacToe/TicTacToeHooks';
import RockPaperScissors from '../RockPaperScissors/RockPaperScissors';
import Chat from '../Chat/Chat';
import GameNav from '../GameNav/GameNav';
import PlayerNameplates from '../gameboard/PlayerNameplates';
import './GameRoom.css';
import io from 'socket.io-client';
import queryString from 'query-string';
// const DEVENDPOINT = 'localhost:5000';
// Uncomment for prod
const DEVENDPOINT = 'https://coopgames.herokuapp.com/';

const GameRoom = (props) => {
	// const socket = io(DEVENDPOINT);
	var socket = {};
	// useEffect(() => {
	// possibly useless
	// if (socket.id === undefined) {
	socket = io(DEVENDPOINT);
	// console.log('socket from GameRoom: ', socket);
	// }
	// });
	let styles = {
		width: '100%',
	};
	const { name, room, game } = queryString.parse(props.location.search);
	console.log('props.location.search: ', props.location.search);
	console.log('props: ', props);
	const renderGame = () => {
		if (game === 'tic-tac-toe') {
			return (
				<React.Fragment>
					<TicTacToe socket={socket} ame={name} room={room} game={game} />
				</React.Fragment>
			);
		} else if (game === 'connect-four') {
			return (
				<React.Fragment>
					<GameBoardHooks socket={socket} ame={name} room={room} game={game} />
				</React.Fragment>
			);
		} else if (game === 'rock-paper-scissors') {
			return (
				<React.Fragment>
					<RockPaperScissors
						socket={socket}
						ame={name}
						room={room}
						game={game}
					/>
				</React.Fragment>
			);
		}
	};
	return (
		<div className='ui container game-room-container'>
			<div className='ui center' styles={styles}>
				<PlayerNameplates game={game} />
				<div className='flexContainer'>
					{renderGame()}
					{/* <div>
						<Chat socket={socket} name={name} room={room} game={game} />
					</div> */}
				</div>
				<div>
					<GameNav
						name={name}
						room={room}
						game={game}
						socket={socket}
						location={props.location}
					/>
				</div>
			</div>
		</div>
	);
};

export default GameRoom;
