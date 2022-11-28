import { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { GearIcon, ProfileIcon, SignOutIcon } from '../../assets/icon';
import { AuthContext } from '../../context/auth.context';
import { logoutUser } from '../../utils/firebase/firebase.utils';
import Avatar from '../avatar/avatar.component';
import Button from '../button/button.component';

const ProfileMenuItem = ({
	className = 'px-3 py-3 hover:bg-action transition-all cursor-pointer flex flex-row gap-3 items-center',
	children,
	...rest
}) => (
	<li className={className} {...rest}>
		{children}
	</li>
);

const ProfileMenu = ({ open, setOpen }) => {
	const navigate = useNavigate();

	const onExitOverlay = () => {
		setOpen(false);
	};

	useEffect(() => {
		document.addEventListener('click', onExitOverlay);
		return () => {
			document.removeEventListener('click', onExitOverlay);
		};
	}, []);

	return (
		<ul
			className={`absolute -right-2 bg-layer3 rounded-lg z-10 text-text py-3 w-[200px] flex flex-col ${
				open ? 'visible opacity-100 top-[calc(100%_+_10px)]' : 'invisible opacity-0 top-full'
			} transition-all font-normal text-xl shadow-xl`}
		>
			<ProfileMenuItem
				className='px-3 py-3 hover:bg-action transition-all cursor-pointer flex flex-row gap-3 items-center'
				onClick={() => {
					setOpen(false);
					navigate('/profile');
				}}
			>
				<ProfileIcon />
				Profile
			</ProfileMenuItem>
			<ProfileMenuItem
				className='px-3 py-3 hover:bg-action transition-all cursor-pointer flex flex-row gap-3 items-center'
				onClick={() => {
					setOpen(false);
					navigate('/profile/settings');
				}}
			>
				<GearIcon />
				Setting
			</ProfileMenuItem>
			<ProfileMenuItem
				className='px-3 py-3 hover:bg-action transition-all cursor-pointer flex flex-row gap-3 items-center'
				onClick={logoutUser}
			>
				<SignOutIcon />
				Sign out
			</ProfileMenuItem>
		</ul>
	);
};

const NavBar = () => {
	const { user } = useContext(AuthContext);
	const [open, setOpen] = useState(false);
	const location = useLocation();
	const isAuth = location.pathname.match(/^\/register|^\/login/gm);

	const onToggleProfile = () => {
		setOpen((prev) => !prev);
	};

	return (
		<>
			<nav className={`w-full sticky z-10 ${open && 'xs:z-20'}`}>
				<div className='m-auto max-w-7xl p-5 flex justify-between items-center'>
					<Link to='/' className='block'>
						<img src='/MyChat.svg' className='h-8' />
					</Link>
					{!isAuth && (
						<div
							className='flex flex-row gap-5 items-center relative'
							onClick={(e) => e.stopPropagation()}
						>
							{user ? (
								<>
									<Avatar
										members={[user]}
										className='rounded-full overflow-hidden cursor-pointer'
										onClick={onToggleProfile}
										avaSize={40}
									/>
									<ProfileMenu open={open} setOpen={setOpen} />
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
