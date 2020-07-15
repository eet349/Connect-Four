import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

import './Join.css';
import GameExample from './GameExample/GameExample';

const Join = () => {
	return (
		<div className='header'>
			<h1>Join Page</h1>
			<div className='flexContainer'>
				<div className='flexContainer'>
					<div className='GameExample'>
						<GameExample game={'connect-four'} />
					</div>
					<div className='GameExample'>
						<GameExample game={'tic-tac-toe'} />
					</div>
					<div className='GameExample'>
						<GameExample game={'rock-paper-scissors'} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Join;
