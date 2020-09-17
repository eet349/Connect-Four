import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import RoomList from '../RoomList/RoomList';
import Modal from '../Modal';
import './JoinRoom.css';
import { setCurrentPlayerName } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';

import {
	createRoomList,
	getRoomsList,
	updateRoomData,
	deleteRoom,
} from '../../actions';

import history from '../../history';

const JoinRoom = (props) => {
	const dispatch = useDispatch();

	const [game, setGame] = useState('');
	const [room, setRoom] = useState('');
	const [roomId, setRoomId] = useState('');
	const [name, setName] = useState('');
	const [occupancy, setOccupancy] = useState('');

	const [createRoom, setCreateRoom] = useState(false);

	const roomsList = useSelector((state) => state.socket.roomsList);

	const setRoomName = (roomName, roomId) => {
		setRoom(roomName);
		setRoomId(roomId);
	};

	useEffect(() => {
		const { game } = queryString.parse(props.location.search);
		setGame(game);
		dispatch(getRoomsList());
		console.log('roomsList: ', roomsList);
	}, [props.location.search]);

	const renderModalActions = () => {
		return (
			<React.Fragment>
				<button
					type='submit'
					onClick={() => {
						if (name && room) {
							const roomsListNames = roomsList.map((roomName) => roomName.name);
							if (roomsListNames.indexOf(room) === -1) {
								history.push(
									`gameroom/?name=${name}&room=${room}&game=${game}`
								);
							}
						} else {
							console.log(
								'Room name taken. Please choose a new name of join an available room.'
							);
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
					autoFocus
					placeholder='Enter name'
					type='text'
					className='form-input'
					onChange={(event) => setName(event.target.value)}
					value={name}
				/>
				<input
					autoFocus
					placeholder='Enter room name'
					type='text'
					className='form-input'
					onChange={(event) => setRoom(event.target.value)}
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							if (name && room) {
								const roomsListNames = roomsList.map(
									(roomName) => roomName.name
								);
								if (roomsListNames.indexOf(room) === -1) {
									history.push(
										`gameroom/?name=${name}&room=${room}&game=${game}`
									);
								}
							} else {
								console.log(
									'Room name taken. Please choose a new name of join an available room.'
								);
							}
						}
					}}
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
						<RoomList
							roomsList={roomsList}
							setRoomName={setRoomName}
							name={name}
							game={game}
						/>
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
						pathname: `gameroom/`,
						search: `?name=${name}&room=${room}&game=${game}`,
						state: {
							fromJoinRoom: true,
						},
					}}
				>
					<button
						onClick={() => {
							const roomNamesTemp = roomsList.map((room) => room.name);
							const occ = roomNamesTemp.indexOf(room);
							// console.log('occ: ', occ);
							// console.log('numUsers +1: ', roomsList[occ].numUsers + 1);
						}}
						className='ui button primary'
					>
						Join Room
					</button>
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
