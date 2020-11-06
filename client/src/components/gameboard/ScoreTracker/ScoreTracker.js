import React from 'react';

import './ScoreTracker.css';

const ScoreTracker = (props) => {
	return (
		<div className={`score-container-${props.color} score-container`}>
			<p className='score-text'>{`wins: ${props.scores}`}</p>
			<p className='score-text hidden-score-text'>{`Connect Four wins: ${props.scores}`}</p>
			<p className='score-text hidden-score-text'>{`Tic-Tac-Toe wins: ${props.scores}`}</p>
			<p className='score-text hidden-score-text'>{`Rock Paper Scissors wins: ${props.scores}`}</p>
			<p className='score-text hidden-score-text'>{`Total wins: ${props.scores}`}</p>
		</div>
	);
};

export default ScoreTracker;
