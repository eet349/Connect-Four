import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
// import queryString from 'query-string';
// import io from 'socket.io-client';

import InfoBar from '../Chat/InfoBar/InfoBar';
import Input from './Input/Input';
import Messages from './Messages/Messages';
// import CurrentUsers from '../CurrentUsers/CurrentUsers';

import './Chat.css';

let socket;

const Chat = (props) => {
	const [name, setName] = useState('');
	const [room, setRoom] = useState('');
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [users, setUsers] = useState([]);
	// const SOCKETENDPOINT = 'https://heychatapp.herokuapp.com/'; // used to be 'localhost:5000' in dev;
	const DEVENDPOINT = 'localhost:5000';
	const userName = useSelector((state) => state.socket.userName);
	const userRoom = useSelector((state) => state.socket.userRoom);
	useEffect(() => {
		// const { name, room } = queryString.parse(location.search);
		// socket = io(SOCKETENDPOINT);
		// socket = io(DEVENDPOINT);
		setName(userName);
		setRoom(userRoom);

		// socket.emit('join', { name: name, room: room }, (error) => {
		// 	if (error) {
		// 		alert(error);
		// 	}
		// });

		// return () => {
		// 	socket.emit('disconnect');

		// 	socket.off();
		// };
		// }, [SOCKETENDPOINT, location.search]);
	}, [DEVENDPOINT]);

	useEffect(() => {
		props.socket.on('message', (message) => {
			setMessages((msgs) => [...msgs, message]);
		});
		props.socket.on('roomData', ({ users }) => {
			setUsers(users);
		});
	}, []);

	// use effect for handling room occupancy and data

	// Function for sending Messages
	const sendMessage = (event) => {
		event.preventDefault();
		if (message) {
			props.socket.emit('sendMessage', message, () => setMessage(''));
		}
	};

	return (
		<div className='outerContainer'>
			<div className='container'>
				<InfoBar room={userRoom} />
				<Messages messages={messages} name={name} />
				<Input
					message={message}
					setMessage={setMessage}
					sendMessage={sendMessage}
				/>
			</div>
			{/* <CurrentUsers users={users} /> */}
		</div>
	);
};

export default Chat;
