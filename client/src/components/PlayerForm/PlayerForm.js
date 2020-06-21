import React from 'react';
import { Field, reduxForm } from 'redux-form';

class PlayerForm extends React.Component {
	renderError({ error, touched }) {
		if (touched && error) {
			return (
				<div className='ui error message'>
					<div className='header'>{error}</div>
				</div>
			);
		}
	}

	renderInputField = ({ input, label, meta }) => {
		const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
		return (
			<div className={className}>
				<label>{label}</label>
				<input {...input} autoComplete='off' />
				{this.renderError(meta)}
			</div>
		);
	};
	renderEmailField = ({ input, label, meta }) => {
		const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
		return (
			<div className={className}>
				<label>{label}</label>
				<input {...input} autoComplete='off' type='email' />
				{this.renderError(meta)}
			</div>
		);
	};
	renderPasswordField = ({ input, label, meta }) => {
		const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
		return (
			<div className={className}>
				<label>{label}</label>
				<input {...input} autoComplete='off' type='password' />
				{this.renderError(meta)}
			</div>
		);
	};

	onSubmit = (formValues) => {
		this.props.onSubmit(formValues);
	};

	render() {
		return (
			<form
				onSubmit={this.props.handleSubmit(this.onSubmit)}
				className='ui form error'
			>
				<Field name='name' component={this.renderInputField} label='Name: ' />
				<Field
					name='userName'
					component={this.renderInputField}
					label='Username: '
				/>
				<Field
					name='email'
					component={this.renderEmailField}
					label='E-mail: '
				/>
				<Field
					name='password'
					component={this.renderPasswordField}
					label='Password: '
				/>
				<button className='ui button primary'>Submit</button>
			</form>
		);
	}
}

const validate = (formValues) => {
	const errors = {};
	if (!formValues.name) {
		//only ran if the user did not enter a title
		errors.name = 'You must enter a name.';
	}
	if (!formValues.userName) {
		errors.userName = 'You must enter a description.';
	}
	if (!formValues.password) {
		errors.password = 'You must enter a description.';
	}
	return errors;
};

export default reduxForm({
	form: 'PlayerForm',
	validate /*validate: validate */,
})(PlayerForm);
