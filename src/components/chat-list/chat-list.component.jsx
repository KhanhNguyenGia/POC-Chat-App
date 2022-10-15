import { useContext } from 'react';
import { AuthContext } from '../../context/auth.context';
import { ChatContext, CHAT_ACTION_TYPES } from '../../context/chat.context';

const ChatListItem = ({ id, member }) => {
	const { dispatch } = useContext(ChatContext);
	return (
		<div
			onClick={() => {
				dispatch({ type: CHAT_ACTION_TYPES.SET_CHAT, payload: id });
			}}
			style={{
				display: 'flex',
				color: '#fff',
				padding: '10px 20px',
				gap: 20,
				borderRadius: 4,
				cursor: 'pointer',
				alignItems: 'center',
			}}
		>
			{/* <div
				style={{
					background: '#002d96',
					width: 40,
					height: 40,
					display: 'grid',
					placeItems: 'center',
					borderRadius: 9999,
				}}
			>
				{member.email.charAt(0).toUpperCase()}
			</div> */}
			<span style={{ overflow: 'hidden' }}>{member.email.toUpperCase()}</span>
		</div>
	);
};

const ChatList = ({ onNewChat, chats }) => {
	const { user } = useContext(AuthContext);
	return (
		<div
			style={{
				display: 'flex',
				flexFlow: 'column',
				background: '#222',
				borderRadius: 4,
				padding: 10,
				flex: 1,
				gap: 20,
				maxWidth: '30%',
			}}
		>
			<button onClick={() => onNewChat(true)}>New chat</button>
			<div
				style={{
					display: 'flex',
					flexFlow: 'column',
					background: '#333',
					borderRadius: 4,
					width: '100%',
				}}
			>
				{chats?.map(({ id, members }) => (
					<ChatListItem
						id={id}
						member={members.find((member) => member.uid != user.uid)}
						key={id}
					/>
				))}
			</div>
		</div>
	);
};

export default ChatList;
