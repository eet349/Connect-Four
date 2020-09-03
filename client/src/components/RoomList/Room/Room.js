import React from 'react';
import history from '../../../history';
import './Room.css';

const Room = (props) => {
	// console.log('props: ', props);

	// return <li>{props.roomName}</li>;
	const name = props.name;
	const room = props.roomName;
	const game = props.game;
	// console.log('props in Room: ', props);
	return (
		<button
			onClick={() => {
				if (name && room) {
					// history.push(`gameroom/?name=${name}&room=${room}&game=${game}`);
					// console.log('room: ', room);
					props.setRoomName(room, props.roomId);
				}
			}}
			className='room-button'
		>
			<span className='room-button-name'>{props.roomName}</span>
			<span className='room-num-users'>{props.numUsers}</span>
		</button>
	);
};

export default Room;
