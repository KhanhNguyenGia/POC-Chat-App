import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { Fragment, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { AuthContext } from '../../context/auth.context';
import { ChatContext, CHAT_ACTION_TYPES } from '../../context/chat.context';
import {
	checkChatExists,
	checkChatValid,
	createGroupChat,
	createNewChat,
	db,
	searchUser,
} from '../../utils/firebase/firebase.utils';
import ChatInput from '../chat-input/chat-input.component';
import ChatList from '../chat-list/chat-list.component';
import ChatMain from '../chat-main/chat-main.component';
import NewChatOverlay from '../new-chat-overlay/new-chat-overlay.component';
import _, { debounce } from 'lodash';
import Avatar from '../avatar/avatar.component';
import Button from '../button/button.component';
import {
	BackIcon,
	BellIcon,
	DeleteIcon,
	DocumentIcon,
	DownChevronIcon,
	GearIcon,
	MoreIcon,
	SparkleIcon,
	ZoomInIcon,
	ZoomOutIcon,
} from '../../assets/icon';
import { Link } from 'react-router-dom';
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
		childClass: 'p-4 hover:bg-action w-full cursor-pointer flex flex-row justify-between gap-5',
		chevron: true,
	},
	{
		title: (
			<>
				<GearIcon />
				<span className=' xs:inline'>Gear</span>
			</>
		),
		content: 'This is Gear',
		childClass: 'p-4 hover:bg-action w-full cursor-pointer flex flex-row justify-between gap-5',
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
		content: 'This is files',
		childClass: 'p-4 hover:bg-action w-full cursor-pointer flex flex-row justify-between gap-5',
		chevron: true,
	},
	{
		title: (
			<div className='hover:bg-red-500 flex flex-row gap-5 justify-center w-full py-4 cursor-pointer'>
				<DeleteIcon />
				Delete
			</div>
		),
		chevron: false,
	},
];

const MoreList = ({ showExtra }) => {
	return (
		<CollapseList
			list={MORE_LIST}
			className={`absolute top-[calc(100%_+_12px)] bg-[#333] shadow-xl text-text py-5 transition-all ${
				showExtra ? '-right-0 visible opacity-100' : '-right-20 opacity-0 invisible'
			}`}
		/>
	);
};

const ChatHeader = ({ members }) => {
	// const { dispatch } = useContext(ChatContext);
	const navigate = useNavigate();
	const [showExtra, setShowExtra] = useState(false);
	const names = useMemo(
		() => members?.map((member) => member.email.split('@')[0].slice(0, 8)).join(', '),
		[members]
	);

	useEffect(() => {
		if (!members) navigate('/');
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
						navigate('/');
					}}
				>
					<BackIcon />
				</Button>
				<Avatar members={members} avaSize={40} />
				<div className='text-text font-bold text-xl'>{names}</div>
			</div>
			<div>
				<Button color='icon' className='h-[40px]' onClick={() => setShowExtra((prev) => !prev)}>
					<MoreIcon className='stroke-2' />
				</Button>
			</div>
			<MoreList showExtra={showExtra} />
		</div>
	);
};

const Chat = () => {
	// const { chat } = useContext(ChatContext);
	const { chatId: chat } = useParams();
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const [newSearch, setNewSearch] = useState('');
	const [chats, setChats] = useState([]);
	const [openNewChat, setOpenNewChat] = useState(false);
	const [found, setFound] = useState([]);
	const [users, setUsers] = useState([]);
	const [preview, setPreview] = useState(null);

	const members = useMemo(
		() => chats.find((_) => _.id === chat)?.members.filter((member) => member.uid !== user.uid),
		[chats, chat]
	);

	const onAddUser = (user) => {
		if (users.map((user) => user.uid).includes(user.uid)) return;
		setUsers((prev) => [...prev, user]);
	};

	const onNewSearch = (e) => {
		setNewSearch(e.target.value);
		onSearchDebounce(e.target.value);
	};

	const onSearch = async (value) => {
		const found = await searchUser(value, user.email);
		setFound(found);
	};

	const onSearchDebounce = useCallback(
		debounce((value) => onSearch(value), 300),
		[]
	);

	const onNewChat = async (other) => {
		if (!(await checkChatExists([user, other])) && user.email !== other.email) {
			await createNewChat(user, other);
		}
		setFound([]);
		setUsers([]);
		setNewSearch('');
		setOpenNewChat(false);
	};

	const onNewGroupChat = async (other) => {
		const { displayName, uid, photoURL, email } = user;
		if (!(await checkChatExists([user, ...other])) && user.email !== other.email) {
			await createGroupChat([{ displayName, uid, email, photoURL }, ...other]);
		}
		setFound([]);
		setUsers([]);
		setNewSearch('');
		setOpenNewChat(false);
	};

	// Add onzoom with maxzoom of 3x
	const onZoomIn = (e) => {
		e.stopPropagation();
		const ref = document.querySelector('#preview-image');
		const scale = ref.style.transform ? +ref.style.transform.slice(6, -1) + 0.1 : 1.1;
		if (scale > 1.5) return;
		ref.style.transform = `scale(${scale})`;
	};

	//onZoomout with minzoom of 0.5
	const onZoomOut = (e) => {
		e.stopPropagation();
		const ref = document.querySelector('#preview-image');
		const scale = ref.style.transform ? +ref.style.transform.slice(6, -1) - 0.1 : 0.9;
		if (scale < 0.5) return;
		ref.style.transform = `scale(${scale})`;
	};

	useEffect(() => {
		const checkChat = async () => {
			try {
				const result = await checkChatValid(chat);
				if (!result) {
					navigate('/');
				}
			} catch (error) {
				console.log(error);
			}
		};
		checkChat();

		const memQ = query(
			collection(db, `/chats`),
			where('membersId', 'array-contains', `${user.uid}`)
		);
		const orderQ = query(memQ, orderBy('updated', 'desc'));
		const unsubscribeFromChatList = onSnapshot(orderQ, (docs) => {
			setChats((prev) =>
				docs.docs.map((doc, index) => ({
					...doc.data(),
					id: doc.id,
				}))
			);
		});
		return () => {
			unsubscribeFromChatList();
		};
	}, []);

	useEffect(() => {
		const input = document.getElementById('search-user');
		input?.focus();
	}, [openNewChat]);

	return (
		<>
			<main className='relative w-full max-h-full h-full overflow-hidden'>
				<div className='flex gap-5 h-full max-h-full'>
					<ChatList
						setOpenNewChat={setOpenNewChat}
						chats={chats}
						newSearch={newSearch}
						onNewSearch={onNewSearch}
					/>
					<div
						className={`absolute ${
							chat ? '-right-0 flex' : '-right-full'
						} flex-[4] xs:relative xs:right-0 max-h-full h-full bg-layer xs:flex flex-col m-auto rounded-lg gap-3 p-3 overflow-hidden w-full transition-all`}
					>
						{!!chats.length && chat && members ? (
							<>
								<ChatHeader members={members} />
								<ChatMain chat={chat} setPreview={setPreview} />
								<ChatInput />
							</>
						) : (
							<div className='text-text font-semibold text-2xl h-max m-auto'>
								Choose a conversation
							</div>
						)}
					</div>
				</div>
			</main>
			{openNewChat && (
				<NewChatOverlay
					users={users}
					onAddUser={onAddUser}
					newSearch={newSearch}
					onNewSearch={onNewSearch}
					setOpenNewChat={setOpenNewChat}
					found={found}
					onNewGroupChat={onNewGroupChat}
					setUsers={setUsers}
					onNewChat={onNewChat}
				/>
			)}
			{preview && (
				<div
					className='w-screen h-screen absolute top-0 left-0 bg-[#0009] z-20 overflow-hidden'
					onClick={() => setPreview(null)}
				>
					<div className='w-full h-[60px] bg-layer' onClick={(e) => e.stopPropagation()}>
						<div className='w-full h-full max-w-7xl flex justify-between items-center p-5'>
							<div className='flex flex-row gap-5'>
								<Button color='icon' onClick={onZoomOut}>
									<ZoomOutIcon />
								</Button>
								<Button color='icon' onClick={onZoomIn}>
									<ZoomInIcon />
								</Button>
							</div>
							<a href={preview.ref} target='_blank' download>
								<Button>Download</Button>
							</a>
						</div>
					</div>
					<div
						className='w-max flex justify-center items-center flex-col m-auto text-text '
						style={{ height: 'calc(100% - 60px)' }}
					>
						<div className='w-full h-ull grid place-items-center'>
							{preview.type.startsWith('image/') ? (
								<div
									className='flex flex-col items-center justify-center gap-10'
									onClick={(e) => e.stopPropagation()}
								>
									<img src={preview.ref} className='max-w-[70vw] max-h-[70vh]' id='preview-image' />
								</div>
							) : (
								<div
									className='flex flex-col gap-3 items-center font-medium text-xl'
									onClick={(e) => e.stopPropagation()}
								>
									<div>File name: {preview.name}</div>
									<div>Preview is not available</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Chat;
