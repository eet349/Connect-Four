import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import history from '../../../history';
import './GameExample.css';
// import '../../../Recources/gifs/';
import connectFourGif from '../../../Recources/gifs/connect-four-animated.gif';
import ticTacToeGif from '../../../Recources/gifs/Tic-tac-toe-animated.gif';

class GameExample extends React.Component {
	renderGameDemo(game) {
		if (game === 'connect-four') {
			return (
				<div>
					<img
						src={connectFourGif}
						width='120'
						height='100'
						alt='Game demo'
						name='connect four demo'
					/>
				</div>
			);
		} else if (game === 'tic-tac-toe') {
			return (
				<div>
					<img
						src={ticTacToeGif}
						width='100'
						height='100'
						alt='Game demo'
						name='connect four demo'
					/>
				</div>
			);
		}
	}

	renderGameExample() {
		return (
			<React.Fragment>
				<div className='outerGameExample'>
					<div>
						<div id='game-header'>
							<h2>{this.props.game}</h2>
						</div>
						<button
							className='game-button'
							onClick={() => history.push(`/join?game=${this.props.game}`)}
						>
							Play
						</button>
					</div>
					<div>
						<div className='GameExample-bottom'>
							{this.renderGameDemo(this.props.game)}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
	render() {
		return (
			<div>
				<div></div>
				{this.renderGameExample()}
			</div>
		);
	}
}
const mapStateToProps = (state, ownProps) => {
	return {
		isSignedIn: state.auth.isSignedIn,
		game: ownProps.game,
	};
};
export default connect(mapStateToProps, {})(GameExample);
