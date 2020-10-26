import React from 'react';
import { useSelector } from 'react-redux';
import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './Message/Message';
import './Messages.css';

const Messages = (props) => {
	const userName = useSelector((state) => state.socket.userName);
	// const room = useSelector(state.socket.userRoom);

	return (
		// <ScrollToBottom className='messages'>
		<ScrollToBottom>
			{props.messages
				? props.messages.map((message, i) => (
						<div key={i}>
							<Message message={message} name={userName} />
						</div>
				  ))
				: null}
		</ScrollToBottom>
	);
};
export default Messages;
