import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

import './Join.css';
import GameExample from './GameExample/GameExample';

const Join = () => {
	const [name, setName] = useState('');
	const [room, setRoom] = useState('');

	return (
		<div>
			Join Page
			<GameExample game={'connect-four'} />
			<GameExample game={'tic-tac-toe'} />
			<GameExample game={'rock-paper-scissors'} />
		</div>
	);
};

export default Join;
