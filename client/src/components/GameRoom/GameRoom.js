import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GameBoardHooks from '../gameboard/GameBoardHooks';
import TicTacToe from '../TicTacToe/TicTacToeHooks';
import RockPaperScissors from '../RockPaperScissors/RockPaperScissors';
import Chat from '../Chat/Chat';
import GameNav from '../GameNav/GameNav';
import PlayerNameplates from '../gameboard/PlayerNameplates';
import MinimizedChat from '../Chat/MinimizedChat/MinimizedChat';
import {
	setRoom,
	setUsers,
	setCurrentPlayer,
	setCurrentPlayerName,
	setFirstplayerName,
	toggleCurrentPlayer,
} from '../../actions';
import './GameRoom.css';
import io from 'socket.io-client';
import queryString from 'query-string';
const DEVENDPOINT = 'localhost:5000';
// Uncomment for prod
// const DEVENDPOINT = 'https://coopgames.herokuapp.com/';

const GameRoom = (props) => {
	const dispatch = useDispatch();
	const socket = io(DEVENDPOINT);
	const [hideChat, setHideChat] = useState(false);
	const [messages, setMessages] = useState([]);
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
		};
	}, [props.location.search]);

	useEffect(() => {
		socket.on('roomData', (userData) => {
			dispatch(setRoom(userData.room));
			dispatch(setUsers(userData.users));
			dispatch(setCurrentPlayer(userData.currentPlayer));
			dispatch(setFirstplayerName(userData.users[0].name));

			if (userData.users[0].name !== name.trim().toLowerCase()) {
				dispatch(toggleCurrentPlayer(1));
			}
			dispatch(setCurrentPlayerName(userData.users[0].name));
		});
	});
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
		if (!hideChat) {
			return (
				<div className='show-chat'>
					<Chat
						socket={socket}
						name={name.trim().toLowerCase()}
						room={room}
						game={game}
						messages={messages}
						setMessages={setMessages}
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
						messages={messages}
						setMessages={setMessages}
						setHideChat={handleHideChat}
					/>
					</div>
					<div className='sticky-container'>
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
