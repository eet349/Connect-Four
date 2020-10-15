import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import InfoBar from '../Chat/InfoBar/InfoBar';
import Input from './Input/Input';
import Messages from './Messages/Messages';
// import CurrentUsers from '../CurrentUsers/CurrentUsers';

import './Chat.css';

const Chat = (props) => {
	const [name, setName] = useState('');
	const [room, setRoom] = useState('');
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [users, setUsers] = useState([]);
	// const [collapsed, setCollapsed] = useState('');
	// var collapsed = '';
	const DEVENDPOINT = 'localhost:5000';
	// const DEVENDPOINT = 'https://coopgames.herokuapp.com/';

	const userName = useSelector((state) => state.socket.userName);
	const userRoom = useSelector((state) => state.socket.userRoom);
	useEffect(() => {
		setName(userName);
		setRoom(userRoom);
	}, [DEVENDPOINT]);

	useEffect(() => {
		props.socket.on('message', (message) => {
			setMessages((msgs) => [...msgs, message]);
		});

		props.socket.on('roomData', ({ users, room }) => {
			setUsers(users);
			setRoom(room);
		});
	}, []);

	// use effect for handling room occupancy and data

	// Function for sending Messages
	const sendMessage = (event) => {
		event.preventDefault();
		if (message) {
			props.socket.emit(
				'sendMessage',
				{ name: props.name, room: props.room, message },
				() => setMessage('')
			);
		}
	};

	// const sendMessage = (event) => {
	// 	event.preventDefault();
	// 	if (message) {
	// 		props.socket.emit('sendMessage', message, () => setMessage(''));
	// 	}
	// };

	return (
		<div className='outerContainer'>
			<div className='container'>
				<div className={`chat-collapse`}>
					<InfoBar room={userRoom} setHideChat={props.setHideChat} />
					<Messages messages={messages} name={name} />
				</div>
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
