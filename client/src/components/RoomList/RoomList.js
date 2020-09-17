import React, { useState, useEffect } from 'react';
import Room from './Room/Room';
import './RoomList.css';

const RoomList = (props) => {
	const renderRoomList = () => {
		const gameRoomsList = props.roomsList.filter(
			(room) => room.game === props.game
		);
		return gameRoomsList.map((room) => {
			return (
				<div className='room-list-element'>
					<Room
						name={props.name}
						roomName={room.name}
						roomId={room._id}
						numUsers={room.numUsers}
						setRoomName={props.setRoomName}
					/>
				</div>
			);
		});
	};

	return (
		<div>
			<h3>Rooms:</h3>
			<ul className='room-list'>{renderRoomList()}</ul>
		</div>
	);
};

export default RoomList;
