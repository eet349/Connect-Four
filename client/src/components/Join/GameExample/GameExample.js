import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import history from '../../../history';
import './GameExample.css';

class GameExample extends React.Component {
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
						<div className='GameExample-bottom'>Bottom Part</div>
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
