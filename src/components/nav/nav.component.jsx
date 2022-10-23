import { useContext } from 'react';
import { Outlet } from 'react-router';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';
import { logoutUser } from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';

const NavBar = () => {
	const { user } = useContext(AuthContext);

	return (
		<>
			<nav className='w-full'>
				<div className='m-auto max-w-7xl p-5 flex justify-between items-center'>
					<div className='text-text font-bold text-xl'>
						<Link to='/'>Logo</Link>
					</div>
					<div className='flex flex-row gap-5 items-center'>
						{user ? (
							<>
								{user.photoURL ? (
									<img
										src={user.photoURL}
										alt={user.email}
										width={40}
										height={40}
										className='object-cover object-center rounded-full'
									/>
								) : (
									<div className='text-text bg-action w-10 h-10 rounded-full flex justify-center items-center font-bold'>
										{user.email.charAt(0).toUpperCase()}
									</div>
								)}
								<Button color='primary' onClick={logoutUser}>
									SIGN OUT
								</Button>
							</>
						) : (
							<Link to='/signin'>
								<Button>SIGN IN</Button>
							</Link>
						)}
					</div>
				</div>
			</nav>
			<div className='px-5 max-w-7xl m-auto w-full'>
				<Outlet />
			</div>
		</>
	);
};

export default NavBar;
