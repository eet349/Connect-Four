import React from 'react';
import './GameNav.css';
import history from '../../history';
import { Link } from 'react-router-dom';

const GameNav = (props) => {
	const games = ['connect-four', 'tic-tac-toe', 'rock-paper-scissors'];
	const renderChooseGames = () => {
		const renderedGames = games.map((navGame) => {
			// console.log('game: ', game);
			return (
				<React.Fragment>
					<div id='gameButtonCard'>
						<button
							id='gameNavButton'
							onClick={() => {
								console.log('props: ', props);
								// if (props.name && props.room) {
								// 	history.push(
								// 		`gameroom/?name=${props.name}&room=${props.room}&game=${props.game}`
								// 	);
								// }
							}}
						>
							<Link
								id='gameNavLinks'
								to={`gameroom/?name=${props.name}&room=${props.room}&game=${navGame}&switchGame=true`}
							>
								{navGame}
							</Link>
						</button>
					</div>
				</React.Fragment>
			);
		});
		return renderedGames;
	};

	return (
		<div id='gameNav'>
			<h3 className='gameNavHeader'>Choose another game</h3>
			{renderChooseGames()}
		</div>
	);
};

export default GameNav;
