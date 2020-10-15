import React, { useState, useEffect } from 'react';
import './playerNameplates.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// In charge of rendering the nameplates and the title at the top
// Nameplate1 -- Connect Four  -- Nameplate2
const PlayerNameplates = (props) => {
	const [playerOne, setPlayerOne] = useState('');
	const [playerTwo, setPlayerTwo] = useState('');
	const [currentPlayerName, setCurrentPlayerName] = useState(
		props.currentPlayerName
	);
	const [currentPlayerBorderOne, setCurrentPlayerBorderOne] = useState('');
	const [currentPlayerBorderTwo, setCurrentPlayerBorderTwo] = useState('');

	useEffect(() => {
		if (props.users[0]) setPlayerOne(props.users[0].name);
		if (props.users[0] && props.users[1]) {
			setPlayerOne(props.users[0].name);
			setPlayerTwo(props.users[1].name);
			setCurrentPlayerName(props.currentPlayerName);
			setCurrentPlayerBorderOne(
				currentPlayerName === playerOne ? 'currentPlayer' : 'Player One'
			);
			setCurrentPlayerBorderTwo(
				currentPlayerName === playerTwo ? 'currentPlayer' : ''
			);
		}
	}, [
		playerOne,
		playerTwo,
		currentPlayerName,
		currentPlayerBorderOne,
		currentPlayerBorderTwo,
		props.currentPlayerName,
		props.users,
	]);

	return (
		<div
			className='ui three column grid container nameplate'
			id='nameplate'
			style={{
				marginBottom: '25px',
				padding: '20px',
				borderRadius: '10px',
				display: 'flex',
			}}
		>
			<div className='column'>
				<div className={`nameplate ${currentPlayerBorderOne}`} id='nameplate1'>
					<div>
						<h2>{props.users[0] ? playerOne : null}</h2>
					</div>
				</div>
			</div>
			<h1
				className='column'
				style={{ textAlign: 'center', fontSize: '40px', fontWeight: '800' }}
			>
				{props.game}
				{/* CONNECT FOUR */}
			</h1>
			<div className='column' style={{ textAlign: 'right' }}>
				<div className={`nameplate ${currentPlayerBorderTwo}`} id='nameplate2'>
					<div>
						<h2>{props.users[1] ? playerTwo : 'Player Two'}</h2>
					</div>
				</div>
			</div>
		</div>
	);
};
const mapStateToProps = (state, ownProps) => {
	return {
		name: ownProps.match.params.name,
		users: state.socket.users,
		currentPlayerName: state.connectFour.currentPlayerName,
	};
};
export default withRouter(connect(mapStateToProps, {})(PlayerNameplates));
