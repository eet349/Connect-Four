import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import RoomList from '../RoomList/RoomList';
import Modal from '../Modal';
import './JoinRoom.css';
import { setCurrentPlayerName } from '../../actions';
import history from '../../history';

const JoinRoom = (props) => {
	const [game, setGame] = useState('');
	const [room, setRoom] = useState('');
	const [name, setName] = useState('');
	const [createRoom, setCreateRoom] = useState(false);

	useEffect(() => {
		const { game } = queryString.parse(props.location.search);
		setGame(game);
	}, [props.location.search]);

	const renderModalActions = () => {
		return (
			<React.Fragment>
				<button
					onClick={() => {
						if (name && room) {
							history.push(`gameroom/?name=${name}&room=${room}&game=${game}`);
							// history.push(`${game}/?name=${name}&room=${room}`);
						}
					}}
					className='ui button primary'
				>
					Create Room
				</button>
				<button
					onClick={() => {
						setCreateRoom(false);
						setRoom('');
					}}
					className='ui button'
				>
					<Link to={`/join?game=${game}`}>Cancel</Link>
				</button>
			</React.Fragment>
		);
	};
	const renderModalContent = () => {
		return (
			<React.Fragment>
				<input
					placeholder='Enter name'
					type='text'
					className='form-input'
					onChange={(event) => setName(event.target.value)}
					value={name}
				/>
				<input
					placeholder='Enter room name'
					type='text'
					className='form-input'
					onChange={(event) => setRoom(event.target.value)}
				/>
			</React.Fragment>
		);
	};

	const renderCreateRoomInput = () => {
		if (createRoom) {
			return (
				<React.Fragment>
					<Modal
						title='Create Room'
						content={renderModalContent()}
						actions={renderModalActions()}
						onDismiss={() => history.push(`/join?game=${game}`)}
					/>
				</React.Fragment>
			);
		}
	};

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
						{renderCreateRoomInput()}
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
						pathname: `/${game}/name=${name}&room=${room}`,
						state: {
							fromJoinRoom: true,
						},
					}}
				>
					<button
						className='ui button primary'
						onClick={() => setCreateRoom(true)}
					>
						Create Room
					</button>
				</Link>
			</div>
		);
	};
	return renderContent();
};

export default JoinRoom;
