import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import history from '../history';

import Join from './Join/Join';
import SignIn from './SignIn/SignIn';
import ProfilePage from './Profile/ProfilePage';
import CompleteProfile from './Profile/CompleteProfile';

import JoinRoom from './JoinRoom/JoinRoom';
// import CreateRoom from './CreateRoom/CreateRoom';
import ConnectFour from './gameboard/ConnectFour';
import TicTacToe from './TicTacToe/TicTacToe';
import RockPaperScissors from './RockPaperScissors/RockPaperScissors';
import GameRoom from './GameRoom/GameRoom';

const App = () => {
	var styles = {
		width: '100%',
	};
	return (
		<Router history={history}>
			<NavBar />
			<div className='ui center' styles={styles}>
				<Switch>
					{/* <Route path='/' exact component={ConnectFour} />
					<Route path='/profile' component={ProfilePage} />
					<Route path='/signup' component={CompleteProfile} /> */}

					<Route path='/' exact component={Join} />
					<Route path='/signin' component={SignIn} />
					<Route path='/profile' component={ProfilePage} />
					<Route path='/signup' component={CompleteProfile} />
					<Route path='/join' component={JoinRoom} />
					{/* <Route path='/create' component={CreateRoom} /> */}
					<Route path='/connect-four/' component={ConnectFour} />
					{/* <Route path='/connect-four/:name' component={ConnectFour} /> */}
					<Route path='/tic-tac-toe' component={TicTacToe} />
					<Route path='/rock-paper-scissors' component={RockPaperScissors} />
					<Route path='/gameroom' component={GameRoom} />
				</Switch>
			</div>
		</Router>
	);
};

export default App;
