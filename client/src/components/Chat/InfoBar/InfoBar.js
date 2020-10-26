import React from 'react';
import './InfoBar.css';

const InfoBar = ({ room, setHideChat }) => (
	<div className='infoBar'>
		<div className='leftInnerContainer'>
			<img className='onlineIcon' src='http://bit.ly/secondIcon' alt='online' />
			<div>
				<h3>{room}</h3>
			</div>
		</div>
		<div className='rightInnerContainer'>
			<button className='chat-hide-btn' onClick={() => setHideChat(true)}>
				<img src='http://bit.ly/firstIcon' alt='close' />
			</button>
		</div>
	</div>
);

export default InfoBar;
