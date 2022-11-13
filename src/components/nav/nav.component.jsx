import { useContext, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { GearIcon, ProfileIcon, SignOutIcon } from '../../assets/icon';
import { AuthContext } from '../../context/auth.context';
import { logoutUser } from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';

const NavBar = () => {
	const { user } = useContext(AuthContext);
	const [openProfile, setOpenProfile] = useState(false);
	const location = useLocation();
	const isAuth = location.pathname.match(/^\/register|^\/login/gm);

	const onToggleProfile = () => {
		setOpenProfile((prev) => !prev);
	};

	return (
		<>
			<nav className='w-full sticky z-10'>
				<div className='m-auto max-w-7xl p-5 flex justify-between items-center'>
					<Link to='/' className='block'>
						<img src='/MyChat.svg' className='h-8' />
					</Link>
					{!isAuth && (
						<div className='flex flex-row gap-5 items-center relative'>
							{user ? (
								<>
									{user?.photoURL ? (
										<img
											src={user?.photoURL}
											alt={'profile'}
											width={40}
											height={40}
											className='object-cover object-center rounded-full cursor-pointer'
											onClick={onToggleProfile}
										/>
									) : (
										<div
											className='text-text bg-action w-10 h-10 rounded-full flex justify-center items-center font-bold cursor-pointer'
											onClick={onToggleProfile}
										>
											{user.email.charAt(0).toUpperCase()}
										</div>
									)}
									{
										<ul
											className={`absolute top-full -right-2 bg-[#333] rounded-lg z-10 text-text py-3 w-[200px] flex flex-col ${
												openProfile
													? 'visible opacity-100 top-[calc(100%_+_10px)]'
													: 'invisible opacity-0'
											} transition-all font-normal text-xl shadow-xl`}
										>
											<li className='px-3 py-3 hover:bg-action transition-all cursor-pointer flex flex-row gap-3 items-center'>
												<ProfileIcon />
												Profile
											</li>
											<li className='px-3 py-3 hover:bg-action transition-all cursor-pointer flex flex-row gap-3 items-center'>
												<GearIcon />
												Setting
											</li>
											<li
												className='px-3 py-3 hover:bg-action transition-all cursor-pointer flex flex-row gap-3 items-center'
												onClick={logoutUser}
											>
												<SignOutIcon />
												Sign out
											</li>
										</ul>
									}
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
			<div className='xs:px-5 xs:pb-5 max-w-7xl m-auto w-full h-[calc(100vh_-_80px)]'>
				<Outlet />
			</div>
		</>
	);
};

export default NavBar;
