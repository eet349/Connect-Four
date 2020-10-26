import React from 'react';
import ReactDOM from 'react-dom';

const WinnerModal = (props) => {
	// const style = {position: fixed}
	return ReactDOM.createPortal(
		<div
			onClick={props.onDismiss}
			className='ui dimmer modals visible active'
			style={{ zIndex: '10', position: 'fixed' }}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className='ui standard modal visible active'
			>
				<div className='header'>{props.title}</div>
				<div className='content'>{props.winner}</div>
				<div className='actions'>{props.actions}</div>
			</div>
		</div>,
		document.querySelector('#modal')
	);
};

export default WinnerModal;
