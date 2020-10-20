import React, { useEffect, useState } from 'react';
import GameBoardHooks from '../gameboard/GameBoardHooks';
import TicTacToe from '../TicTacToe/TicTacToeHooks';
import RockPaperScissors from '../RockPaperScissors/RockPaperScissors';
import Chat from '../Chat/Chat';
import GameNav from '../GameNav/GameNav';
import PlayerNameplates from '../gameboard/PlayerNameplates';
import MinimizedChat from '../Chat/MinimizedChat/MinimizedChat';
import './GameRoom.css';
import io from 'socket.io-client';
import queryString from 'query-string';
const DEVENDPOINT = 'localhost:5000';
// Uncomment for prod
// const DEVENDPOINT = 'https://coopgames.herokuapp.com/';

const GameRoom = (props) => {
	const socket = io(DEVENDPOINT);
	const [hideChat, setHideChat] = useState(false);
	const { name, room, game, switchGame } = queryString.parse(
		props.location.search
	);

	useEffect(() => {
		socket.emit(
			'join',
			{
				name: name.trim().toLowerCase(),
				room,
				game,
				switchGame,
			},
			(error) => {
				if (error) {
					alert(error);
				}
			}
		);
		return () => {
			socket.emit('disconnect');
			// socket.off();
		};
	}, [props.location.search]);

	let styles = {
		width: '100%',
	};

	const handleHideChat = (set) => {
		setHideChat(set);
	};

	const renderGame = () => {
		if (game === 'tic-tac-toe') {
			return (
				<React.Fragment>
					<TicTacToe
						socket={socket}
						name={name.trim().toLowerCase()}
						room={room}
						game={game}
					/>
				</React.Fragment>
			);
		} else if (game === 'connect-four') {
			return (
				<React.Fragment>
					<GameBoardHooks
						socket={socket}
						name={name.trim().toLowerCase()}
						room={room}
						game={game}
					/>
				</React.Fragment>
			);
		} else if (game === 'rock-paper-scissors') {
			return (
				<React.Fragment>
					<RockPaperScissors
						socket={socket}
						name={name.trim().toLowerCase()}
						room={room}
						game={game}
					/>
				</React.Fragment>
			);
		}
	};
	const renderChat = () => {
		/* // hideChat ? <Chat className='hide-chat'>
    & show <MinimizedChat className='show-minimized-chat'>*/

		if (!hideChat) {
			return (
				<div className='show-chat'>
					<Chat
						socket={socket}
						name={name.trim().toLowerCase()}
						room={room}
						game={game}
						setHideChat={handleHideChat}
					/>
				</div>
			);
		} else {
			return (
				<>
					<div className='hide-chat'>
						<Chat
							socket={socket}
							name={name.trim().toLowerCase()}
							room={room}
							game={game}
							setHideChat={handleHideChat}
						/>
					</div>
					<div>
						<MinimizedChat setHideChat={handleHideChat} />
					</div>
				</>
			);
		}
	};

	return (
		<div className='ui container game-room-container'>
			<div className='ui center' styles={styles}>
				<PlayerNameplates game={game} />
				<div className='flexContainer'>
					{renderGame()}
					{renderChat()}
				</div>
				<div>
					<GameNav
						socket={socket}
						name={name.trim().toLowerCase()}
						room={room}
						game={game}
						location={props.location}
					/>
				</div>
			</div>
		</div>
	);
};

export default GameRoom;
