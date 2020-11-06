import React from 'react';

import './ScoreTracker.css';

const getCurrentGameScore = (scores, game) => {
	switch (game) {
		case 'connect-four':
			return scores.C4Score;
		case 'tic-tac-toe':
			return scores.TTTScore;
		case 'rock-paper-scissors':
			return scores.RPSScore;
	}
};
const ScoreTracker = (props) => {
	var currentGameScores =
		props.scores !== 0 ? getCurrentGameScore(props.scores, props.game) : 0;
	// var currentGameScores = 0;
	console.log('props.scores: ', props.scores);
	return (
		<div className={`score-container-${props.color} score-container`}>
			<p className='score-text'>{`wins: ${currentGameScores}`}</p>
			<p className='score-text hidden-score-text'>{`Connect Four wins: ${props.scores.C4Score}`}</p>
			<p className='score-text hidden-score-text'>{`Tic-Tac-Toe wins: ${props.scores.TTTScore}`}</p>
			<p className='score-text hidden-score-text'>{`Rock Paper Scissors wins: ${props.scores.RPSScore}`}</p>
			<p className='score-text hidden-score-text'>{`Total wins: ${
				props.scores.C4Score + props.scores.TTTScore + props.scores.RPSScore
			}`}</p>
		</div>
	);
};

export default ScoreTracker;
