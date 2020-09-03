import React, { useState, useEffect } from 'react';
import Room from './Room/Room';
// import { useSelector } from 'react-redux';
import './RoomList.css';

const RoomList = (props) => {
	// console.log('props.roomsList: ', props.roomsList);

	const renderRoomList = () => {
		return props.roomsList.map((room) => {
			// console.log('room.name: ', room.name);
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
