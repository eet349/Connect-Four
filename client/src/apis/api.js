import axios from 'axios';

// const base = axios.create({
// 	baseURL: 'http://localhost:5000',
// });
// Uncomment from Prod
const base = axios.create({
	baseURL: 'https://coopgames.herokuapp.com/',
});

export default base;
