import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './GameExample.css';

class GameExample extends React.Component {
	renderGameExample() {
		if (this.props.isSignedIn) {
			return (
				<React.Fragment>
					<div>
						<div>
							<div>Top Part</div>
							<div>{this.props.game}</div>
							<button>
								<Link to={`/${this.props.game}`} className='item'>
									Start Playing
								</Link>
							</button>
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
				<div className='outerGameExample'>
					<div>
						<div>
							<h3>Top Part</h3>
						</div>
						<div>
							<h5>{this.props.game}</h5>
						</div>
						<button>
							<Link
								to={`/join?game=${this.props.game}`}
								className='item'
								id='GameExample-button'
							>
								Play
							</Link>
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
