import React, { useState, useEffect } from 'react';
import './GameNav.css';
import history from '../../history';
import WinnerModal from '../WinnerModal';
import { useDispatch, useSelector } from 'react-redux';

import {
	setChangeGameModalOpen,
	setPlayerSwitchApproval,
	setOpponentSwitchApproval,
} from '../../actions';
var intervalId = 0;

const GameNav = (props) => {
	const games = ['connect-four', 'tic-tac-toe', 'rock-paper-scissors'];
	const [selectedGame, setSelectedGame] = useState(null);
	const [gameChangersName, setGameChangersName] = useState('');
	const [countdownText, setCountdownText] = useState(30);
	const [newGame, setNewGame] = useState('');
	const [countdownStarted, setCountdownStarted] = useState(false);
	const playerSwitchApproval = useSelector(
		(state) => state.gameNav.playerSwitchApproval
	);
	const opponentSwitchApproval = useSelector(
		(state) => state.gameNav.opponentSwitchApproval
	);

	const users = useSelector((state) => state.socket.users);
	const changeGameModalOpen = useSelector(
		(state) => state.gameNav.changeGameModalOpen
	);

	const dispatch = useDispatch();

	useEffect(() => {
		props.socket.on('serverChangeGameModalData', (serverData) => {
			console.log('serverData: ', serverData);
			setSelectedGame(serverData.newGame);
			setNewGame(serverData.newGame);
			setGameChangersName(serverData.changersName);
			if (!countdownStarted) {
				setCountdownStarted(true);
				startCountDown();
			}
			dispatch(setChangeGameModalOpen(true));
			waitForApproval();
		});
		if (!playerSwitchApproval || !opponentSwitchApproval) {
			props.socket.on('serverSwitchApproval', (serverSwitchApproval) => {
				console.log('serverSwitchApproval: ', serverSwitchApproval);
				const userNames = users.map((user) => user.name);

				const opponentNameIndex = userNames.findIndex(
					(userName) => userName === serverSwitchApproval.name
				);
				if (serverSwitchApproval.name === props.name) {
					dispatch(setPlayerSwitchApproval(true));
				} else {
					dispatch(setOpponentSwitchApproval(true));
				}
			});
		}

		return () => {};
	}, [props.location.search]);

	const startCountDown = () => {
		var timer = 30;
		intervalId = setInterval(() => {
			if (timer >= 0) {
				setCountdownText(timer);
				timer = timer - 1;
				console.log('timer: ', timer);
			} else if (timer < 0 || !changeGameModalOpen) {
				console.log('time ran out!');
				dispatch(setPlayerSwitchApproval(false));
				dispatch(setOpponentSwitchApproval(false));
				setCountdownStarted(false);

				exitInterval(intervalId);
				dispatch(setChangeGameModalOpen(false));
			}
		}, 1000);
	};

	const exitInterval = (id) => {
		setCountdownStarted(false);
		clearInterval(id);
	};

	const waitForApproval = () => {
		if (playerSwitchApproval && !opponentSwitchApproval) {
			console.log('waiting for opponent approval');
		} else if (!playerSwitchApproval) {
			console.log('please approve if you want to switch games');
		} else if (playerSwitchApproval && opponentSwitchApproval) {
			exitInterval(intervalId);
			dispatch(setPlayerSwitchApproval(false));
			dispatch(setOpponentSwitchApproval(false));
		}
	};

	const renderChooseGames = () => {
		const renderedGames = games.map((navGame) => {
			return (
				<React.Fragment>
					<div id='gameButtonCard'>
						<button
							id='gameNavButton'
							onClick={() => {
								setSelectedGame(navGame);
								props.socket.emit('changeGameModalData', {
									changersName: props.name,
									userRoom: props.room,
									newGame: navGame,
								});
							}}
						>
							{navGame}
						</button>
					</div>
				</React.Fragment>
			);
		});
		return renderedGames;
	};

	const renderActions = () => {
		if (playerSwitchApproval && !opponentSwitchApproval) {
			console.log('waiting for opponent approval');
		} else if (!playerSwitchApproval && opponentSwitchApproval) {
			console.log('please approve if you want to switch games');
		} else if (playerSwitchApproval && opponentSwitchApproval) {
			dispatch(setChangeGameModalOpen(false));
			exitInterval(intervalId);
			setGameChangersName(undefined);
			dispatch(setPlayerSwitchApproval(false));
			dispatch(setOpponentSwitchApproval(false));

			history.replace(
				`/gameroom/?name=${props.name}&room=${props.room}&game=${newGame}&switchGame=true`
			);
		}
		return (
			<React.Fragment>
				<button
					onClick={() => {
						props.socket.emit('sendSwitchApproval', {
							name: props.name,
							room: props.room,
							playerSwitchApproval,
							opponentSwitchApproval,
						});
					}}
					className='ui button primary'
				>
					Switch Game
				</button>
			</React.Fragment>
		);
	};

	const renderModalTitle = () => {
		if (props.name === gameChangersName) {
			if (playerSwitchApproval) {
				return `Waiting for opponent approval. Countdown: ${countdownText}`;
			}
			return `Are you sure you want to change the game?  Countdown: ${countdownText}`;
		} else {
			if (playerSwitchApproval) {
				return `Waiting for opponent approval. Countdown: ${countdownText}`;
			}
			return `${gameChangersName} wishes to change to the game to ${selectedGame}. Countdown: ${countdownText}`;
		}
	};

	const renderContent = () => {
		if (changeGameModalOpen) {
			return (
				<>
					{renderChooseGames()}
					<div className='switch-game-modal'>
						<WinnerModal
							title={renderModalTitle()}
							actions={renderActions()}
							onDismiss={() => history.push('/')}
						/>
					</div>
				</>
			);
		}
		return renderChooseGames();
	};

	return (
		<div id='gameNav'>
			<h3 className='gameNavHeader'>Choose another game</h3>
			{renderContent()}
		</div>
	);
};

export default GameNav;
