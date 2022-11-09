import { useContext, useState } from 'react';
import ReactTimeAgo from 'react-time-ago';
import { AuthContext } from '../../context/auth.context';
import { ChatContext, CHAT_ACTION_TYPES } from '../../context/chat.context';
import Button from '../button/button.component';

const AVA_SIZE = 50;

const Avatar = ({ members }) => {
	switch (members.length) {
		case 1:
			return (
				<div
					className={`flex flex-row rounded-lg overflow-hidden`}
					style={{
						width: AVA_SIZE,
						height: AVA_SIZE,
						minWidth: AVA_SIZE,
						minHeight: AVA_SIZE,
					}}
				>
					{members.map((member) =>
						member?.photoURL ? (
							<img
								key={member?.email}
								src={member?.photoURL}
								alt={member?.email}
								className={`object-center object-cover`}
								style={{
									width: AVA_SIZE / 1,
									height: AVA_SIZE / 1,
								}}
							/>
						) : (
							<div
								key={member?.email}
								className={`text-text font-medium text-4xl flex justify-center items-center`}
								style={{
									background: `#${Math.floor(Math.random() * 999999 + 1)}`,
									width: AVA_SIZE / 1,
									height: AVA_SIZE / 1,
								}}
							>
								{member?.email.charAt(0).toUpperCase()}
							</div>
						)
					)}
				</div>
			);
		case 2:
			return (
				<div
					className={`flex flex-row rounded-lg overflow-hidden flex-wrap`}
					style={{
						width: AVA_SIZE,
						height: AVA_SIZE,
						minWidth: AVA_SIZE,
						minHeight: AVA_SIZE,
					}}
				>
					{members.map((member) =>
						member?.photoURL ? (
							<img
								key={member?.email}
								src={member?.photoURL}
								alt={member?.email}
								className={`object-center object-cover`}
								style={{
									width: AVA_SIZE / 2,
									height: AVA_SIZE / 1,
								}}
							/>
						) : (
							<div
								key={member?.email}
								className={`text-text font-medium text-2xl flex justify-center items-center`}
								style={{
									background: `#${Math.floor(Math.random() * 999999 + 1)}`,
									width: AVA_SIZE / 2,
									height: AVA_SIZE / 1,
								}}
							>
								{member?.email.charAt(0).toUpperCase()}
							</div>
						)
					)}
				</div>
			);
		case 3:
			return (
				<div
					className={`flex flex-row rounded-lg overflow-hidden flex-wrap`}
					style={{
						width: AVA_SIZE,
						height: AVA_SIZE,
						minWidth: AVA_SIZE,
						minHeight: AVA_SIZE,
					}}
				>
					{members.map((member, index) =>
						member?.photoURL ? (
							<img
								key={member?.email}
								src={member?.photoURL}
								alt={member?.email}
								className={`object-center object-cover`}
								style={{
									width: index === 2 ? AVA_SIZE / 1 : AVA_SIZE / 2,
									height: AVA_SIZE / 2,
								}}
							/>
						) : (
							<div
								key={member?.email}
								className={`text-text font-medium text-xl flex justify-center items-center`}
								style={{
									background: `#${Math.floor(Math.random() * 999999 + 1)}`,
									width: index === 2 ? AVA_SIZE / 1 : AVA_SIZE / 2,
									height: AVA_SIZE / 2,
								}}
							>
								{member?.email.charAt(0).toUpperCase()}
							</div>
						)
					)}
				</div>
			);
		default:
			return (
				<div
					className={`flex flex-row rounded-lg overflow-hidden flex-wrap`}
					style={{
						width: AVA_SIZE,
						height: AVA_SIZE,
						minWidth: AVA_SIZE,
						minHeight: AVA_SIZE,
					}}
				>
					{members.map((member) =>
						member?.photoURL ? (
							<img
								key={member?.email}
								src={member?.photoURL}
								alt={member?.email}
								className={`object-center object-cover`}
								style={{
									width: AVA_SIZE / 2,
									height: AVA_SIZE / 2,
								}}
							/>
						) : (
							<div
								key={member?.email}
								className={`text-text font-medium text-xl flex justify-center items-center`}
								style={{
									background: `#${Math.floor(Math.random() * 999999 + 1)}`,
									width: AVA_SIZE / 2,
									height: AVA_SIZE / 2,
								}}
							>
								{member?.email.charAt(0).toUpperCase()}
							</div>
						)
					)}
				</div>
			);
	}
};

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
			<div className='hidden md:flex flex-col gap-1 overflow-hidden'>
				<div className='text-text font-medium inline truncate'>{names}</div>
				<div className='text-[#fff9] inline truncate'>
					<ReactTimeAgo date={date} timeStyle='mini-minute-now' />
				</div>
			</div>
		</div>
	);
};

const ChatListLoading = () => (
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
		<div className='hidden md:flex-1 flex-col bg-layer rounded-lg p-3 gap-5 xs:flex overflow-hidden'>
			<div className='sticky'>
				{/* <input
					className='hidden md:block px-3 py-2 rounded-lg w-full h-[50px]'
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
					: [...Array(10)].map((_, index) => <ChatListLoading key={index} />)}
			</div>
		</div>
	);
};

export default ChatList;
