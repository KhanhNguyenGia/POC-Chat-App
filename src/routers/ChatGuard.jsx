import { useContext, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { ChatHeader, ChatInput, ChatMain } from '../components/chat';
import Spinner from '../components/spinner/spinner.component';
import { AuthContext } from '../context/auth.context';
import { ChatProvider } from '../context/chat.context';
import { checkChatValid } from '../utils/firebase/firebase.utils';

const ChatGuard = () => {
	const { chatId } = useParams();
	const { user } = useContext(AuthContext);
	const [chatValid, setChatValid] = useState(undefined);

	useEffect(() => {
		const checkChat = async () => {
			const result = await checkChatValid(chatId, user.uid);
			setChatValid(result);
		};
		checkChat();
	}, []);
	if (chatValid === undefined) {
		return <Spinner />;
	}
	if (!chatValid) return <Navigate to='/chat' />;
	return (
		<ChatProvider>
			<ChatHeader />
			<ChatMain />
			<ChatInput />
		</ChatProvider>
	);
};
export default ChatGuard;
