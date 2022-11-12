import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/auth.context';
import { ChatContext, CHAT_ACTION_TYPES } from '../../context/chat.context';
import {
	checkChatExists,
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

const ChatHeader = ({ members }) => {
	const { dispatch } = useContext(ChatContext);
	const names = members.map((member) => member.email.split('@')[0].slice(0, 8)).join(', ');
	return (
		<>
			<div className='flex flex-row items-center justify-between w-full rounded-lg'>
				<div className='flex flex-row items-center gap-3'>
					<Button
						type='button'
						className='w-max flex-none xs:hidden'
						onClick={() => {
							dispatch({ type: CHAT_ACTION_TYPES.CLEAR_CHAT });
						}}
					>
						&lt;
					</Button>
					<Avatar members={members} avaSize={40} />
					<div className='text-text font-bold text-xl'>{names}</div>
				</div>
				<div>
					<Button color='icon' className='h-[40px]'>
						<img src='/more.svg' alt='' width={20} height={20} />
					</Button>
				</div>
			</div>
		</>
	);
};

const Chat = () => {
	const { chat } = useContext(ChatContext);
	const { user } = useContext(AuthContext);
	const [newSearch, setNewSearch] = useState('');
	const [chats, setChats] = useState([]);
	const [openNewChat, setOpenNewChat] = useState(false);
	const [found, setFound] = useState([]);
	const [users, setUsers] = useState([]);

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

	useEffect(() => {
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
			<main className='relative w-full h-full overflow-hidden'>
				<div className='flex gap-5 h-full max-h-full'>
					<ChatList
						setOpenNewChat={setOpenNewChat}
						chats={chats}
						newSearch={newSearch}
						onNewSearch={onNewSearch}
					/>
					<div
						className={`${
							chat ? 'absolute flex' : 'hidden'
						} flex-[4] xs:relative max-h-full h-full bg-layer xs:flex flex-col m-auto rounded-lg gap-3 p-3 overflow-hidden w-full`}
					>
						{chat ? (
							<>
								<ChatHeader
									members={chats
										.find((_) => _.id === chat)
										.members.filter((member) => member.uid !== user.uid)}
								/>
								<ChatMain chat={chat} />
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
		</>
	);
};

export default Chat;
