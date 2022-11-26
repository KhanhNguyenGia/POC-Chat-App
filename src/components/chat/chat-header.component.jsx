import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
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
import { ChatContext, CHAT_ACTION_TYPES } from '../../context/chat.context';
import { getChatInfo, getChatMembers, updateChatColor } from '../../utils/firebase/firebase.utils';
import Avatar from '../avatar/avatar.component';
import Button from '../button/button.component';
import CollapseList from '../collapse-list/collapse-list.component';
import { Label } from '../profile-page/basic-info-tab.component';
import Switch from '../switch/switch.component';

const MORE_LIST = [
	{
		title: (
			<>
				<BellIcon />
				<span className=' xs:inline'>Notification</span>
			</>
		),
		content: () => (
			<div className='px-3 py-2 m-auto w-max'>
				<div className='flex flex-row gap-3 items-center'>
					<label>Off</label>
					<Switch />
					<label>On</label>
				</div>
			</div>
		),
		chevron: true,
	},
	{
		title: (
			<>
				<GearIcon />
				<span className=' xs:inline'>Setting</span>
			</>
		),
		content: () => (
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
		content: () => {
			const { theme, dispatch } = useContext(ChatContext);
			const [color, setColor] = useState(theme);
			const { chatId } = useParams();

			useEffect(() => {
				setColor(theme);
			}, [theme]);

			const expandColorCode = (code) => {
				if (code.length === 6 || code.length === 8) return code;
				return code
					.split('')
					.map((c) => c + c)
					.join('');
			};

			const onSubmit = async (e) => {
				try {
					e.preventDefault();
					if (!color || theme === color) return;
					const expendedColor = expandColorCode(color);
					if (!expendedColor.match(/^([a-f0-9]{6}|[a-f0-9]{8})$/gim)) {
						toast.error('Invalid color code');
						return;
					}
					dispatch({ type: CHAT_ACTION_TYPES.UPDATE_COLOR, payload: color });
					await updateChatColor(chatId, color);
					toast.success('Color has been updated');
				} catch (error) {
					toast.error('Failed to change color');
				}
			};

			return (
				<form className='flex flex-col gap-5 px-3 py-2 items-center' onSubmit={onSubmit}>
					<div className='flex justify-center items-center'>
						<input
							className='bg-transparent '
							id='chat-color'
							name='chat-color'
							type='color'
							value={'#' + expandColorCode(color)}
							onChange={(e) => setColor(e.target.value.slice(1))}
						/>
						<div className='ml-10'>
							<span className='text-xl'>#</span>
							<input
								className='ml-2 w-20 bg-transparent outline-none border-b-2 focus:border-slate-500 transition-all'
								htmlFor='chat-color'
								value={color}
								onChange={(e) => setColor(e.target.value)}
								maxLength={8}
								minLength={3}
							/>
						</div>
					</div>
					{color !== theme && (
						<Button className='w-max' type='submit' style={{ background: '#' + color }}>
							Save
						</Button>
					)}
				</form>
			);
		},
		chevron: true,
	},
	{
		title: (
			<>
				<DocumentIcon />
				<span className=' xs:inline'>Files</span>
			</>
		),
		content: () => <div className='px-3 py-2'>Collection of files and images sent</div>,
		chevron: true,
	},
];

const MoreList = ({ showExtra }) => {
	return (
		<CollapseList
			list={MORE_LIST}
			className={`absolute top-[calc(100%)] bg-layer3 shadow-xl text-text py-5 flex flex-col gap-5 transition-all rounded-lg max-w-xs z-20 ${
				showExtra ? '-right-0 visible opacity-100' : '-right-20 opacity-0 invisible'
			}`}
		/>
	);
};

const ChatHeader = () => {
	// const { dispatch } = useContext(ChatContext);
	const { chatId } = useParams();
	const { user } = useContext(AuthContext);
	const { dispatch } = useContext(ChatContext);
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
		const getChat = async () => {
			const chatInfo = await getChatInfo(chatId);
			// console.log(chatInfo);
			const theme = chatInfo.theme ?? '0092CA';
			dispatch({ type: CHAT_ACTION_TYPES.UPDATE_COLOR, payload: theme });
		};
		getChat();
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
