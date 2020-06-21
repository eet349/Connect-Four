import React from 'react';
import { connect } from 'react-redux';
import { createPlayerProfile } from '../../actions/';
import PlayerForm from '../PlayerForm/PlayerForm';

class SignIn extends React.Component {
	onSubmit = (formValues) => {
		this.props.createPlayerProfile(formValues);
	};

	render() {
		return (
			<div className='ui container'>
				<h3>Create a Profile</h3>
				<PlayerForm onSubmit={this.onSubmit} />
			</div>
		);
	}
}

export default connect(null, { createPlayerProfile })(SignIn);
