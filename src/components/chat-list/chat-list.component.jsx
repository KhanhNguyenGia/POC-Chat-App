import { useContext } from 'react';
import ReactTimeAgo from 'react-time-ago';
import { AuthContext } from '../../context/auth.context';
import { ChatContext, CHAT_ACTION_TYPES } from '../../context/chat.context';
import Button from '../button/button.component';
import Avatar from '../avatar/avatar.component';

const ChatListItem = ({ id, members, selected, newUpdate, updated }) => {
	const { dispatch } = useContext(ChatContext);
	const names = members.map((member) => member.email.split('@')[0].slice(0, 8)).join(', ');
	const date = new Date(updated);
	return (
		<div
			onClick={() => {
				dispatch({ type: CHAT_ACTION_TYPES.SET_CHAT, payload: id });
			}}
			className={`flex flex-row gap-4 cursor-pointer rounded-lg p-2 items-center transition-all duration-300 ${
				selected ? ' bg-secondary' : newUpdate ? 'bg-primary' : 'bg-[#333]'
			} overflow-hidden md:w-full hover:bg-action`}
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
		className={`animate-pulse flex flex-row gap-4 rounded-lg p-2 bg-[#333] items-center overflow-hidden md:w-full min-h-[66px]`}
	>
		<div className='w-[50px] h-[50px] bg-[#444] rounded-full'></div>
		<div className='hidden md:flex flex-col gap-2 overflow-hidden w-2/3'>
			<div className='text-text font-medium inline truncate bg-[#444] w-full h-5'></div>
			<div className='text-[#fff9] inline truncate w-2/3 h-3 bg-[#444]'></div>
		</div>
	</div>
);

const ChatList = ({ setOpenNewChat, chats }) => {
	const { user } = useContext(AuthContext);
	const { chat } = useContext(ChatContext);
	return (
		<div className='md:flex-1 flex-col bg-layer rounded-lg p-3 gap-5 flex overflow-hidden max-h-full xs:flex-none flex-1'>
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
					+
				</Button>
			</div>
			<div className='flex flex-1 flex-col w-full gap-5 max-h-[600px] overflow-auto'>
				{!!chats?.length
					? chats?.map(({ id, members, updated }) => (
							<ChatListItem
								id={id}
								members={members.filter((member) => member.uid != user.uid)}
								key={id}
								selected={chat === id}
								newUpdate={false}
								updated={updated}
							/>
					  ))
					: [...Array(5)].map((_, index) => <ChatListItemLoading key={index} />)}
			</div>
		</div>
	);
};

export default ChatList;
