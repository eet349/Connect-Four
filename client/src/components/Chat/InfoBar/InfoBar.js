import React from 'react';

import './InfoBar.css';

const InfoBar = ({ room }) => (
	<div className='infoBar'>
		<div className='leftInnerContainer'>
			<img className='onlineIcon' src='http://bit.ly/secondIcon' alt='online' />
			<h3>{room}</h3>
		</div>
		<div className='rightInnerContainer'>
			<a href='/'>
				<img src='http://bit.ly/firstIcon' alt='close' />
			</a>
		</div>
	</div>
);

export default InfoBar;
