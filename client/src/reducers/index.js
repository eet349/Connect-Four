import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import connectFourReducer from './connectFourReducer';
import socketReducer from './socketReducer';
import profilesReducer from './profilesReducer';
import TicTacToeReducer from './TicTacToeReducer';

export default combineReducers({
	auth: authReducer,
	form: formReducer,
	connectFour: connectFourReducer,
	socket: socketReducer,
	profiles: profilesReducer,
	tictactoe: TicTacToeReducer,
});
