import React from 'react';
import GoogleAuth from '../GoogleAuth';
import { Link } from 'react-router-dom';

const NavBar = () => {
	return (
		<div
			className='ui secondary pointing menu'
			style={{
				backgroundColor: '#C5C0C0',
				height: '40px',
				marginBottom: '20px',
			}}
		>
			<Link
				to='/'
				className='item'
				style={{
					margin: '-5px 1px',
					color: '#00658F',
					transform: 'scaleY(-1)',
				}}
			>
				<i className='braille icon' style={{ fontSize: '25px' }}></i>
			</Link>
			<div className='right menu'>
				<Link to='/profile' className='item'>
					<div
						style={{
							color: '#2472E7',
							paddingTop: '20px',
							marginTop: '70px',
							marginBottom: '0',
						}}
					>
						<i className='chess pawn icon'></i>
						Profile
					</div>
				</Link>
				<Link to='/signup' className='item'>
					<div
						style={{
							color: '#2472E7',
							paddingTop: '20px',
							marginTop: '70px',
							marginBottom: '0',
						}}
					>
						<i className='address card icon'></i>
						Sign-up
					</div>
				</Link>
				<div style={{ margin: '3px 10px' }}>
					<Link to='/'>
						<GoogleAuth />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NavBar;
