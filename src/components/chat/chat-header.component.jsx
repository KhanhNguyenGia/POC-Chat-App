import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
	BackIcon,
	BellIcon,
	DeleteIcon,
	DocumentIcon,
	GearIcon,
	MoreIcon,
	SparkleIcon,
} from '../../assets/icon';
import { AuthContext } from '../../context/auth.context';
import { getChatMembers } from '../../utils/firebase/firebase.utils';
import Avatar from '../avatar/avatar.component';
import Button from '../button/button.component';
import CollapseList from '../collapse-list/collapse-list.component';

const MORE_LIST = [
	{
		title: (
			<>
				<BellIcon />
				<span className=' xs:inline'>Notification</span>
			</>
		),
		content: 'This is Notification',
		chevron: true,
	},
	{
		title: (
			<>
				<GearIcon />
				<span className=' xs:inline'>Setting</span>
			</>
		),
		content: (
			<div className='hover:bg-red-500 flex flex-row gap-5 justify-center w-full py-4 cursor-pointer'>
				<DeleteIcon />
				Delete
			</div>
		),
		chevron: true,
	},
	{
		title: (
			<>
				<SparkleIcon />
				<span className='xs:inline'>Themes</span>
			</>
		),
		content: 'This is themes',
		childClass: 'p-4 hover:bg-action w-full cursor-pointer flex flex-row justify-between gap-5',
		chevron: true,
	},
	{
		title: (
			<>
				<DocumentIcon />
				<span className=' xs:inline'>Files</span>
			</>
		),
		content: <div className='p-3'>This is files</div>,
		childClass: 'p-4 hover:bg-action w-full cursor-pointer flex flex-row justify-between gap-5',
		chevron: true,
	},
];

const MoreList = ({ showExtra }) => {
	return (
		<CollapseList
			list={MORE_LIST}
			className={`absolute top-[calc(100%)] bg-layer3 shadow-xl text-text py-5 flex flex-col gap-5 transition-all rounded-lg ${
				showExtra ? '-right-0 visible opacity-100' : '-right-20 opacity-0 invisible'
			}`}
		/>
	);
};

const ChatHeader = () => {
	// const { dispatch } = useContext(ChatContext);
	const { chatId } = useParams();
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const [showExtra, setShowExtra] = useState(false);
	const [members, setMembers] = useState([]);

	const names = useMemo(
		() => members?.map((member) => member.email.split('@')[0].slice(0, 8)).join(', '),
		[members]
	);

	const onExitOverlay = useCallback(() => {
		setShowExtra(false);
	}, []);

	useEffect(() => {
		const getMembers = async () => {
			const result = await getChatMembers(chatId);
			if (!result) return;
			setMembers(result.filter((member) => member.uid !== user.uid));
		};
		getMembers();
	}, [chatId]);

	useEffect(() => {
		document.addEventListener('click', onExitOverlay);

		return () => {
			document.removeEventListener('click', onExitOverlay);
		};
	}, []);

	return (
		<div className='flex flex-row items-center justify-between w-full rounded-lg relative'>
			<div className='flex flex-row items-center gap-3'>
				<Button
					color='icon'
					type='button'
					className='w-max flex-none xs:hidden px-3'
					onClick={() => {
						// dispatch({ type: CHAT_ACTION_TYPES.CLEAR_CHAT });
						navigate('/chat');
					}}
				>
					<BackIcon />
				</Button>
				<Avatar members={members} avaSize={40} />
				<div className='text-text font-bold text-xl'>{names}</div>
			</div>
			<div>
				<Button
					color='icon'
					className='h-[40px]'
					onClick={(e) => {
						e.stopPropagation();
						setShowExtra((prev) => !prev);
					}}
				>
					<MoreIcon className='stroke-2' />
				</Button>
			</div>
			<MoreList showExtra={showExtra} />
		</div>
	);
};

export default ChatHeader;
