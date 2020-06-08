import React from 'react';
import { Field, reduxForm } from 'redux-form';

class CompleteProfile extends React.Component {
	renderTextInput(label) {
		return (
			<label>
				{label}
				<input type='text'></input>
			</label>
		);
	}
	renderPasswordInput(label) {
		return (
			<label>
				{label}
				<input type='password'></input>
			</label>
		);
	}
	renderSelectInput(label) {
		return (
			<label>
				{label}
				<select name='Gender'>
					<option value='Male'>Male</option>
					<option value='Female'>Female</option>
					<option value='Other'>Other</option>
				</select>
			</label>
		);
	}
	renderDateInput(label) {
		return (
			<label>
				{label}
				<input type='Date'></input>
			</label>
		);
	}
	renderTextArea(label) {
		return (
			<label>
				{label}
				<textarea rows='10' cols='30'></textarea>
			</label>
		);
	}

	render() {
		//	console.log('this.props', this.props);
		return (
			<div className='ui container'>
				<div>
					<div>
						<h1>Complete your profile.</h1>
						<div>
							<form className='ui form'>
								<Field
									name='First Name'
									component={() => this.renderTextInput('First Name')}
								/>
								<Field
									name='Last Name'
									component={() => this.renderTextInput('Last Name')}
								/>
								<Field
									name='Password'
									component={() => this.renderPasswordInput('Password')}
								/>
								<Field
									name='Confirm'
									component={() => this.renderPasswordInput('Confirm')}
								/>
								<Field
									name='User Name'
									component={() => this.renderTextInput('User Name')}
								/>
								<Field
									name='Gender'
									component={() => this.renderSelectInput('Gender')}
								/>
								<Field
									name='Birthday'
									component={() => this.renderDateInput('Birthday')}
								/>
								<Field
									name='Bio'
									component={() => this.renderTextArea('Bio')}
								/>
								<Field
									name='Additional Info'
									component={() => this.renderTextArea('Additional Info')}
								/>
							</form>
						</div>
					</div>
				</div>
				<div></div>
			</div>
		);
	}
}

export default reduxForm({
	form: 'signUp',
})(CompleteProfile);
