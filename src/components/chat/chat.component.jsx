import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router';
import { AuthContext } from '../../context/auth.context';
import { db } from '../../utils/firebase/firebase.utils';
import { ChatList, NewChatOverlay } from '.';
import _ from 'lodash';

const Chat = () => {
	// const { chat } = useContext(ChatContext);
	const { chatId: chat } = useParams();
	const { user } = useContext(AuthContext);
	const [chats, setChats] = useState([]);
	const [openNewChat, setOpenNewChat] = useState(false);

	useEffect(() => {
		document.title = 'Chat | MyChat';
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
					read: doc.id === chat,
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
			<main className='relative xs:static w-full max-h-full h-full overflow-hidden'>
				<div className='flex gap-5 h-full max-h-full'>
					<ChatList setOpenNewChat={setOpenNewChat} chats={chats} />
					<div
						className={`absolute ${
							chat ? '-right-0 flex' : '-right-full'
						} bg-bg xs:bg-layer flex-[4] xs:static xs:right-0 max-h-full h-full xs:flex flex-col m-auto rounded-lg gap-3 p-3 overflow-hidden w-full duration-[230ms] transition-all`}
					>
						<Outlet />
					</div>
				</div>
			</main>
			{openNewChat && <NewChatOverlay setOpenNewChat={setOpenNewChat} />}
		</>
	);
};

export default Chat;
