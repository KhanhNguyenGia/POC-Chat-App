import { useContext } from 'react';
import { AuthContext } from '../../context/auth.context';
import { ChatContext, CHAT_ACTION_TYPES } from '../../context/chat.context';
import Button from '../button/button.component';

// const BACKGROUND_POS = {
// 	1: 'center',
// 	2: 'left center, right center',
// 	3: 'left top, right top, center bottom',
// 	4: 'left top, right top, left bottom, right bottom',
// };

// const BACKGROUND_SIZE = {
// 	1: '40px',
// 	2: '20px 40px',
// 	3: '20px 20px, 20px 20px, 40px 20px',
// 	4: '20px',
// };

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
						member.photoURL ? (
							<img
								src={member.photoURL}
								alt={member.email}
								className={`object-center object-cover`}
								style={{
									width: AVA_SIZE / 1,
									height: AVA_SIZE / 1,
								}}
							/>
						) : (
							<div
								className={`text-text font-medium text-4xl flex justify-center items-center`}
								style={{
									background: `#${Math.floor(Math.random() * 999999 + 1)}`,
									width: AVA_SIZE / 1,
									height: AVA_SIZE / 1,
								}}
							>
								{member.email.charAt(0).toUpperCase()}
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
						member.photoURL ? (
							<img
								src={member.photoURL}
								alt={member.email}
								className={`object-center object-cover`}
								style={{
									width: AVA_SIZE / 2,
									height: AVA_SIZE / 1,
								}}
							/>
						) : (
							<div
								className={`text-text font-medium text-2xl flex justify-center items-center`}
								style={{
									background: `#${Math.floor(Math.random() * 999999 + 1)}`,
									width: AVA_SIZE / 2,
									height: AVA_SIZE / 1,
								}}
							>
								{member.email.charAt(0).toUpperCase()}
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
						member.photoURL ? (
							<img
								src={member.photoURL}
								alt={member.email}
								className={`object-center object-cover`}
								style={{
									width: index === 2 ? AVA_SIZE / 1 : AVA_SIZE / 2,
									height: AVA_SIZE / 2,
								}}
							/>
						) : (
							<div
								className={`text-text font-medium text-xl flex justify-center items-center`}
								style={{
									background: `#${Math.floor(Math.random() * 999999 + 1)}`,
									width: index === 2 ? AVA_SIZE / 1 : AVA_SIZE / 2,
									height: AVA_SIZE / 2,
								}}
							>
								{member.email.charAt(0).toUpperCase()}
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
						member.photoURL ? (
							<img
								src={member.photoURL}
								alt={member.email}
								className={`object-center object-cover`}
								style={{
									width: AVA_SIZE / 2,
									height: AVA_SIZE / 2,
								}}
							/>
						) : (
							<div
								className={`text-text font-medium text-xl flex justify-center items-center`}
								style={{
									background: `#${Math.floor(Math.random() * 999999 + 1)}`,
									width: AVA_SIZE / 2,
									height: AVA_SIZE / 2,
								}}
							>
								{member.email.charAt(0).toUpperCase()}
							</div>
						)
					)}
				</div>
			);
	}
};

const ChatListItem = ({ id, members }) => {
	const { dispatch } = useContext(ChatContext);
	// const backgroundPos = BACKGROUND_POS[members.length] || BACKGROUND_POS[4];
	// const backgroundSize = BACKGROUND_SIZE[members.length] || BACKGROUND_POS[4];
	const names = members.map((member) => member.email.split('@')[0].slice(0, 8)).join(', ');
	return (
		<div
			onClick={() => {
				dispatch({ type: CHAT_ACTION_TYPES.SET_CHAT, payload: id });
			}}
			className='flex flex-row gap-4 cursor-pointer rounded-lg p-2 items-center overflow-hidden bg-[#333] md:w-full hover:bg-action'
		>
			{/* <div
				className='min-h-[40px] min-w-[40px] w-[40px] h-[40px] bg-no-repeat rounded-full'
				style={{
					backgroundImage: members.map(({ photoURL }) => `url(${photoURL})`).join(','),
					backgroundSize: backgroundSize,
					backgroundPosition: backgroundPos,
				}}
			></div> */}
			<Avatar members={members} />
			<div className='hidden text-text md:inline truncate'>{names}</div>
		</div>
	);
};

const ChatList = ({ setOpenNewChat, chats }) => {
	const { user } = useContext(AuthContext);
	return (
		<div className='hidden md:flex-1 flex-col bg-layer rounded-lg p-3 gap-5 xs:flex overflow-hidden'>
			<input
				className='hidden md:block px-3 py-2 rounded-lg w-full h-[50px]'
				placeholder='Search user...'
				onFocus={() => setOpenNewChat(true)}
			/>
			<Button
				className='flex-none md:hidden font-bold h-[50px] rounded-lg'
				onClick={() => setOpenNewChat(true)}
			>
				+
			</Button>
			<div className='flex flex-1 flex-col w-full gap-5'>
				{chats?.map(({ id, members }) => (
					<ChatListItem
						id={id}
						members={members.filter((member) => member.uid != user.uid)}
						key={id}
					/>
				))}
			</div>
		</div>
	);
};

export default ChatList;
