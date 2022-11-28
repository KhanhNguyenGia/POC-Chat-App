import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { db, getChatMembers } from '../utils/firebase/firebase.utils';

const useChatMessage = () => {
	const { chatId } = useParams();
	const [loading, setLoading] = useState(true);
	const [messages, setMessages] = useState([]);
	const [members, setMembers] = useState([]);

	useEffect(() => {
		const unsubscribeFromChat = onSnapshot(
			query(collection(db, `/chats/${chatId}/messages`), orderBy('sent', 'desc')),
			(snapshot) => {
				setLoading(false);
				setMessages(
					snapshot.docs.map((doc) => {
						return {
							...doc.data(),
							id: doc.id,
						};
					})
				);
			}
		);

		const getMembersList = async () => {
			const temp = await getChatMembers(chatId);
			if (!temp) return;
			setMembers(temp);
		};

		getMembersList();

		return () => {
			unsubscribeFromChat();
		};
	}, [chatId]);

	return { loading, messages, members };
};

export default useChatMessage;
