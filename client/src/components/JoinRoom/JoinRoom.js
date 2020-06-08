import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

const JoinRoom = ({ location }) => {
	const [room, setRoom] = useState('');
	const [name, setName] = useState('');

	useEffect(() => {
		const { room } = queryString.parse(location.search);
		console.log('location: ', location);
		setRoom(room);
		console.log('room: ', room);
	}, [location.search]);
	return (
		<div>
			<div>
				<input
					placeholder='Name'
					type='text'
					onChange={(event) => setName(event.target.value)}
				/>
			</div>
			<Link
				onClick={(event) => (!name || !room ? event.preventDefault() : null)}
				to={{
					pathname: `/${room}/${name}`,
					state: {
						fromJoinRoom: true,
					},
				}}
			>
				<button>Join Room</button>
			</Link>
		</div>
	);
};

export default JoinRoom;
