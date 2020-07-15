// import React from 'react';
// import GameBoardHooks from './GameBoardHooks';
// import Chat from '../Chat/Chat';
// import PlayerNameplates from './PlayerNameplates';
// import './ConnectFour.css';
// import io from 'socket.io-client';
// const DEVENDPOINT = 'localhost:5000';

// const ConnectFour = () => {
// 	const socket = io(DEVENDPOINT);
// 	let styles = {
// 		width: '100%',
// 	};
// 	return (
// 		<div>
// 			{/* <div className='ui container center' styles={styles}> */}
// 			<div className='ui center' styles={styles}>
// 				<PlayerNameplates />
// 				<div className='flexContainer'>
// 					<div>
// 						{/* <GameBoard /> */}
// 						{/* <GameBoardFXN /> */}
// 						<GameBoardHooks socket={socket} />
// 					</div>
// 					<div>
// 						<Chat socket={socket} />
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default ConnectFour;
