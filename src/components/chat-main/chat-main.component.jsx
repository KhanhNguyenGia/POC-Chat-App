import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';
import { ChatContext } from '../../context/chat.context';
import { db, getChatMembers } from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';
import ChatBubble from '../chat-bubble/chat-bubble.component';

const ChatMain = ({ chat, setPreview }) => {
	// const { chatId: chat } = useParams();
	// const { chat } = useContext(ChatContext);
	const [messages, setMessages] = useState([]);
	const { user } = useContext(AuthContext);
	const [members, setMembers] = useState([]);

	useEffect(() => {
		const unsubscribeFromChat = onSnapshot(
			query(collection(db, `/chats/${chat}/messages`), limit(50), orderBy('sent', 'desc')),
			(docs) => {
				setMessages(
					docs.docs.map((doc) => {
						return {
							...doc.data(),
							id: doc.id,
						};
					})
				);
			}
		);

		const getMembersList = async () => {
			const temp = await getChatMembers(chat);
			if (!temp) return;
			setMembers(temp);
		};

		getMembersList();

		return () => {
			unsubscribeFromChat();
		};
	}, [chat]);

	useEffect(() => {
		const main = document.querySelector('.chat__main');
		main?.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
	}, [messages]);

	return (
		<>
			<div className='chat__main bg-[#333] w-full rounded-lg flex flex-col-reverse mt-auto p-3 gap-2 overflow-auto h-full max-h-full shadow-xl'>
				{!!messages.length ? (
					messages?.map(({ id, uid, content, fileURL }, index) => (
						<ChatBubble
							key={id}
							current={uid === user.uid}
							belongsTo={members.find((member) => member.uid === uid)}
							same={index !== 0 && messages[index].uid === messages[index - 1].uid}
						>
							{!!fileURL?.length && (
								<div>
									{fileURL.map((file) => {
										if (file.type.startsWith('image/'))
											return (
												<img
													key={file.ref}
													src={file.ref}
													alt='user image'
													className='object-cover object-center w-[60px] h-[60px]'
													onClick={() =>
														setPreview({ ref: file.ref, type: file.type, name: file.name })
													}
												/>
											);
										return (
											<div
												key={file.ref}
												className='h-[40px] rounded-lg px-3 py-2 grid place-items-center'
												onClick={() =>
													setPreview({ ref: file.ref, type: file.type, name: file.name })
												}
											>
												<span href={file.ref} className='text-text cursor-pointer'>
													{file.name}
												</span>
											</div>
										);
									})}
								</div>
							)}
							{content}
						</ChatBubble>
					))
				) : (
					<div className='w-full h-[100px] text-text grid place-items-center'>
						<div>Start the conversation by saying "Hi!"</div>
					</div>
				)}
			</div>
		</>
	);
};

export default ChatMain;
