import { useContext, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';
import { logoutUser } from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';
import ParticleBackground from '../particle-background/particle-background.component';

const NavBar = () => {
	const { user } = useContext(AuthContext);
	const location = useLocation();
	const isAuth = location.pathname.match(/^\/register|^\/login/gm);

	return (
		<>
			<nav className='w-full sticky z-10'>
				<div className='m-auto max-w-7xl p-5 flex justify-between items-center'>
					<Link to='/' className='block'>
						<img src='/MyChat.svg' className='h-8' />
					</Link>
					{!isAuth && (
						<div className='flex flex-row gap-5 items-center'>
							{user ? (
								<>
									{user?.photoURL ? (
										<img
											src={user?.photoURL}
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
								<Link to='/login'>
									<Button>SIGN IN</Button>
								</Link>
							)}
						</div>
					)}
				</div>
			</nav>
			<div className='px-5 max-w-7xl m-auto w-full'>
				<Outlet />
			</div>
		</>
	);
};

export default NavBar;
