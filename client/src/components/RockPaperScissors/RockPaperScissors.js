import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { setRoom, setUsername } from '../../actions';
import queryString from 'query-string';

import './RockPaperScissors.css';

var playerSelec = '';
var oppSelec = '';

const RockPaperScissors = (props) => {
	const OPP = 'opponent';
	const PLYR = 'player';
	const DRAW = 'draw';
	const RPSArray = [
		'ROCK',
		'PAPER',
		'SCISSORS',
		'SHOOT!',
		'SHOOT!',
		'SHOOT!',
		'SHOOT!',
	];
	const [winner, setWinner] = useState('');
	const [showReady, setShowReady] = useState(true);
	const [isCountdownDone, setIsCountdownDone] = useState(false);
	const [playerReadyStatus, setPlayerReadyStatus] = useState(false);
	const [oppReadyStatus, setOppReadyStatus] = useState(false);
	const [countdownText, setCountdownText] = useState('');
	const [rpsSelection, setRpsSelection] = useState('');
	const [opponentRpsSelection, setOpponentRpsSelection] = useState('');
	const dispatch = useDispatch();

	const userName = useSelector((state) => state.socket.userName);
	const userRoom = useSelector((state) => state.socket.userRoom);
	const users = useSelector((state) => state.socket.users);
	const winningPlayer = useSelector(
		(state) => state.rockPaperScissors.winningPlayer
	);
	const canPlay = useSelector((state) => state.rockPaperScissors.canPlay);

	useEffect(() => {
		const { name, room, game, switchGame } = queryString.parse(
			props.location.search
		);
		dispatch(setUsername(name.trim().toLowerCase()));
		dispatch(setRoom(room));
		props.socket.on('serverPlayerReadyStatus', (serverSentReadyStatus) => {
			if (serverSentReadyStatus.userName === name) {
				setPlayerReadyStatus(serverSentReadyStatus.isPlayerReady);
			} else {
				setOppReadyStatus(serverSentReadyStatus.isPlayerReady);
			}
			if (
				(playerReadyStatus && oppReadyStatus) ||
				(serverSentReadyStatus.isOppReady &&
					serverSentReadyStatus.isPlayerReady)
			) {
				setShowReady(false);
				setIsCountdownDone(false);
				startCountdown();
				checkForWinner();

				setOppReadyStatus(false);
				setPlayerReadyStatus(false);
			}
		});
		props.socket.on('serverPlayedRPS', (serverPlayedRPS) => {
			console.log('serverPlayedRPS: ', serverPlayedRPS);
			if (serverPlayedRPS.userName !== name) {
				setOpponentRpsSelection(serverPlayedRPS.rpsSelection);

				oppSelec = serverPlayedRPS.rpsSelection;
			}
		});

		return () => {
			props.socket.off();
		};
	}, [props.location.search]);

	const startCountdown = () => {
		var cdtIndex = 0;
		const intervalID = setInterval(() => {
			console.log(RPSArray[cdtIndex], cdtIndex);
			setCountdownText(RPSArray[cdtIndex++]);
			if (cdtIndex === 4) {
				setIsCountdownDone(true);
			}
			if (cdtIndex > RPSArray.length) {
				clearInterval(intervalID);
				setIsCountdownDone(false);
				setShowReady(true);
				setWinner('');
			}
		}, 750);
		const timeOutID = setTimeout(() => {
			setIsCountdownDone(true);
			checkForWinner(cdtIndex);
		}, 3000);
	};

	const checkForWinner = (cdtIndex) => {
		console.log('player Selection: ', playerSelec);
		console.log('opponent Selection: ', oppSelec);
		if (cdtIndex > 3) {
			if (playerSelec === '✊') {
				if (oppSelec === '✊') {
					setWinner(DRAW);
					console.log('Draw!');
				} else if (oppSelec === '✋') {
					setWinner(OPP);
					console.log('You lose!');
				} else if (oppSelec === '✌') {
					setWinner(PLYR);
					console.log('You win!');
				}
			} else if (playerSelec === '✋') {
				if (oppSelec === '✊') {
					setWinner(PLYR);
					console.log('You win!');
				} else if (oppSelec === '✋') {
					setWinner(DRAW);

					console.log('Draw!');
				} else if (oppSelec === '✌') {
					setWinner(OPP);

					console.log('You lose!');
				}
			} else if (playerSelec === '✌') {
				if (oppSelec === '✊') {
					setWinner(OPP);

					console.log('You lose!');
				} else if (oppSelec === '✋') {
					setWinner(PLYR);

					console.log('You win!');
				} else if (oppSelec === '✌') {
					console.log('Draw!');
				} else if (playerSelec === '') {
					if (oppSelec !== '') {
						console.log('You lose');
					} else {
						setWinner(DRAW);

						console.log('Draw!');
					}
				}
			}
		}
	};

	const renderOpponentSelection = () => {
		return opponentRpsSelection && isCountdownDone ? (
			<div className='rps-final-selections'>{opponentRpsSelection}</div>
		) : (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				stroke='currentColor'
			>
				<path
					stroke-linecap='round'
					stroke-linejoin='round'
					stroke-width='2'
					d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
				/>
			</svg>
		);
	};

	const renderCountdownArea = () => {
		return showReady ? (
			<>
				<div className='ready-status-area'>
					<button
						className={`player-ready-btn ${
							playerReadyStatus ? 'disable-ready-btn' : ''
						}`}
						onClick={() => {
							if (playerReadyStatus) {
								props.socket.emit('RPSReadyStatus', {
									userName,
									userRoom,
									isPlayerReady: false,
									isOppReady: oppReadyStatus,
								});
								setPlayerReadyStatus(false);
							} else {
								props.socket.emit('RPSReadyStatus', {
									userName,
									userRoom,
									isPlayerReady: true,
									isOppReady: oppReadyStatus,
								});
								setPlayerReadyStatus(true);
							}
						}}
					>
						{playerReadyStatus ? 'Unready' : 'Ready!'}
					</button>
					<div
						className={`opp-ready-status ${oppReadyStatus ? 'opp-ready' : ''}`}
					>
						{oppReadyStatus ? 'Opp Ready.' : 'Waiting for Opp'}
					</div>
				</div>
			</>
		) : (
			<>
				<h3>{countdownText}</h3>
			</>
		);
	};

	const renderGameArea = () => {
		return (
			<div className='game-area'>
				<div className='countdown-area'>{renderCountdownArea()}</div>
				<div className='rps-selections'>
					<div
						className='rps-selection-rock rps-selection'
						onClick={(e) => {
							setRpsSelection(e.target.innerHTML);
							playerSelec = e.target.innerHTML;

							props.socket.emit('playRPS', {
								userName,
								room: userRoom,
								rpsSelection: e.target.innerHTML,
							});
						}}
					>
						✊
					</div>
					<div
						className='rps-selection-paper rps-selection'
						onClick={(e) => {
							setRpsSelection(e.target.innerHTML);
							playerSelec = e.target.innerHTML;
							props.socket.emit('playRPS', {
								userName,
								room: userRoom,
								rpsSelection: e.target.innerHTML,
							});
						}}
					>
						✋
					</div>
					<div
						className='rps-selection-scissors rps-selection'
						onClick={(e) => {
							setRpsSelection(e.target.innerHTML);
							playerSelec = e.target.innerHTML;
							props.socket.emit('playRPS', {
								userName,
								room: userRoom,
								rpsSelection: e.target.innerHTML,
							});
						}}
					>
						✌
					</div>
				</div>
				<div className='rps-selected-area'>
					<div
						className={`rps-final-selections rps-selection ${
							winner === PLYR ? 'win playerWin' : ''
						}`}
					>
						{rpsSelection}
					</div>
					<h3>{winner === DRAW ? 'DRAW!' : 'VS'}</h3>
					<div
						className={`rps-selection ${winner === OPP ? 'win oppWin' : ''}`}
					>
						{renderOpponentSelection()}
					</div>
				</div>
			</div>
		);
	};
	return <>{renderGameArea()}</>;
};

export default withRouter(RockPaperScissors);
