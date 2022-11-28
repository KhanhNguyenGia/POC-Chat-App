import { useContext, useEffect, useState } from 'react';
import ReactTimeAgo from 'react-time-ago';
import { AuthContext } from '../../context/auth.context';
import Button from '../button/button.component';
import Avatar from '../avatar/avatar.component';
import { useNavigate, useParams } from 'react-router';
import { AddIcon } from '../../assets/icon';
import NewChatOverlay from './new-chat-overlay.component';
import useChatList from '../../hooks/useChatList.hook.jsx';

const ChatListItem = ({ id, members, selected, newUpdate, updated }) => {
	const navigate = useNavigate();
	const names = members.map((member) => member.email.split('@')[0].slice(0, 8)).join(', ');
	const date = new Date(updated);
	return (
		<div
			onClick={() => {
				navigate(`/chat/${id}`);
			}}
			className={`flex flex-row gap-4 cursor-pointer rounded-lg p-2 items-center transition-all duration-300 ${
				selected ? ' bg-secondary' : newUpdate ? 'bg-primary' : 'bg-layer2'
			} overflow-hidden md:w-full hover:bg-action shadow-xl`}
		>
			<Avatar members={members} />
			<div className='flex xs:hidden md:flex flex-col gap-1 overflow-hidden'>
				<div className='text-text font-medium inline truncate'>{names}</div>
				<div className='text-[#fff9] inline truncate'>
					<ReactTimeAgo date={date} timeStyle='mini-minute-now' />
				</div>
			</div>
		</div>
	);
};

const ChatListItemLoading = () => (
	<div
		className={`animate-pulse flex flex-row gap-4 rounded-lg p-2 bg-layer3 items-center overflow-hidden md:w-full min-h-[66px]`}
	>
		<div className='w-[50px] h-[50px] bg-[#444] rounded-full'></div>
		<div className='hidden md:flex flex-col gap-2 overflow-hidden w-2/3'>
			<div className='text-text font-medium inline truncate bg-[#444] w-full h-5'></div>
			<div className='text-[#fff9] inline truncate w-2/3 h-3 bg-[#444]'></div>
		</div>
	</div>
);

const ChatList = () => {
	const { chatId } = useParams();
	const { user } = useContext(AuthContext);
	const [openNewChat, setOpenNewChat] = useState(false);
	const { chats, loading } = useChatList();

	useEffect(() => {
		const input = document.getElementById('search-user');
		input?.focus();
	}, [openNewChat]);

	return (
		<>
			<div className='md:flex-1 flex-col bg-bg xs:bg-layer xs:rounded-lg p-3 gap-5 flex overflow-hidden max-h-full xs:flex-none flex-1'>
				<div className='sticky'>
					{/* <input
					className='xs:hidden md:block px-3 py-2 rounded-lg w-full h-[50px]'
					placeholder='Search user...'
					onFocus={() => setOpenNewChat(true)}
				/> */}
					<Button
						className='flex-none w-full text-3xl font-bold h-[50px] rounded-lg'
						onClick={() => setOpenNewChat(true)}
					>
						<AddIcon className='stroke-2 m-auto' />
					</Button>
				</div>
				<div className='flex flex-1 flex-col w-full gap-5 max-h-[600px] overflow-auto'>
					{loading
						? [...Array(5)].map((_, index) => <ChatListItemLoading key={index} />)
						: chats?.map(({ id, members, updated }) => (
								<ChatListItem
									id={id}
									members={members.filter((member) => member.uid != user.uid)}
									key={id}
									selected={chatId === id}
									newUpdate={false}
									updated={updated}
								/>
						  ))}
				</div>
			</div>
			{openNewChat && <NewChatOverlay setOpenNewChat={setOpenNewChat} />}
		</>
	);
};

export default ChatList;
