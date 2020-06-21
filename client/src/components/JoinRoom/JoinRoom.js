import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import RoomList from '../RoomList/RoomList';
import './JoinRoom.css';

const JoinRoom = ({ location }) => {
	const [game, setGame] = useState('');
	const [room, setRoom] = useState('');
	const [name, setName] = useState('');

	useEffect(() => {
		const { game } = queryString.parse(location.search);
		console.log('location: ', location);
		setGame(game);
	}, [location.search]);

	const renderContent = () => {
		return (
			<div className='ui container'>
				<div className='ui container'>
					<h1>{game}</h1>
					<div>
						<RoomList />
					</div>
					<form className='form'>
						<input
							placeholder='Enter name'
							type='text'
							className='form-input'
							onChange={(event) => setName(event.target.value)}
						/>
					</form>
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
					<button className='ui button primary'>Join Room</button>
				</Link>
				<Link
					onClick={(event) => (!name || !room ? event.preventDefault() : null)}
					to={{
						pathname: `/${room}/${name}`,
						state: {
							fromJoinRoom: true,
						},
					}}
				>
					<button className='ui button primary'>Create Room</button>
				</Link>
			</div>
		);
	};
	return renderContent();
};

export default JoinRoom;
