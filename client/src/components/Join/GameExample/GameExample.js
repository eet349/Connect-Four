import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class GameExample extends React.Component {
	renderGameExample() {
		if (this.props.isSignedIn) {
			return (
				<React.Fragment>
					<div>
						<div>
							<div>Top Part</div>
							<div>{this.props.game}</div>
							<Link to={`/${this.props.game}`} className='item'>
								Start Playing
							</Link>
							{/* <button>Start Playing</button> */}
						</div>
						<div>
							<div>Bottom Part</div>
						</div>
					</div>
				</React.Fragment>
			);
		}
		return (
			<React.Fragment>
				<div>
					<div>
						<div>Top Part</div>
						<div>{this.props.game}</div>
						<Link to={`/join?room=${this.props.game}`} className='item'>
							Join Room
						</Link>
						<Link to={`/create?room=${this.props.game}`} className='item'>
							Create Room
						</Link>
					</div>
					<div>
						<div>Bottom Part</div>
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
