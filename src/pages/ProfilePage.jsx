import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

const PROFILE_TABS = [
	{
		title: 'Basic Info',
		path: '',
	},
	{
		title: 'Settings',
		path: 'settings',
	},
];

const ProfilePage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { pathname } = location;
	const tabPath = pathname.split('/')[2];

	useEffect(() => {
		document.title = 'Profile | MyChat';
	}, []);

	return (
		<div className='px-3 xs:p-0 flex flex-col md:flex-row gap-3 md:gap-10'>
			<aside className='flex flex-col flex-1 h-max border-2 border-layer2 rounded-lg overflow-hidden min-w-max'>
				{PROFILE_TABS.map((tab, i) => (
					<div
						key={i}
						className={`text-text font-semibold text-xl hover:bg-action cursor-pointer px-4 py-3 transition-all ${
							tabPath === tab.path
								? 'bg-secondary'
								: tabPath === undefined && i === 0
								? 'bg-secondary'
								: ''
						}`}
						onClick={() => navigate(tab.path)}
					>
						{tab.title}
					</div>
				))}
			</aside>
			<Outlet />
		</div>
	);
};

export default ProfilePage;
