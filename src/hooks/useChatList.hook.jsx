import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../context/auth.context';
import { db } from '../utils/firebase/firebase.utils';

const useChatList = () => {
	const { user } = useContext(AuthContext);
	const [chats, setChats] = useState([]);
	const [loading, setLoading] = useState(true);
	const { chatId } = useParams();

	useEffect(() => {
		document.title = 'Chat | MyChat';
		const memQ = query(
			collection(db, `/chats`),
			where('membersId', 'array-contains', `${user.uid}`)
		);
		const orderQ = query(memQ, orderBy('updated', 'desc'));
		const unsubscribeFromChatList = onSnapshot(orderQ, (snapshot) => {
			setLoading(false);
			setChats((prev) =>
				snapshot.docs.map((doc, index) => ({
					...doc.data(),
					id: doc.id,
					read: doc.id === chatId,
				}))
			);
		});

		return () => {
			unsubscribeFromChatList();
		};
	}, []);

	return { chats, loading };
};

export default useChatList;
