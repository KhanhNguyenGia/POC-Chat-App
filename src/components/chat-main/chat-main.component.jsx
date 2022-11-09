import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';
import { db, getChatMembers } from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';
import ChatBubble from '../chat-bubble/chat-bubble.component';

const ChatMain = ({ chat }) => {
	const [messages, setMessages] = useState([]);
	const { user } = useContext(AuthContext);
	const [preview, setPreview] = useState(null);
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
			<div className='chat__main bg-[#333] w-full rounded-lg flex flex-col-reverse mt-auto p-3 gap-2 overflow-auto max-h-[600px]'>
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
													onClick={() => setPreview({ ref: file.ref, type: file.type })}
												/>
											);
										return (
											<div
												key={file.ref}
												className='h-[40px] rounded-lg px-3 py-2 grid place-items-center'
												onClick={() => setPreview({ ref: file.ref, type: file.type })}
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
			{preview && (
				<div
					className='w-screen h-screen absolute top-0 left-0 bg-[#0009]'
					onClick={() => setPreview(null)}
				>
					<div className='w-full h-[60px] bg-layer' onClick={(e) => e.stopPropagation()}>
						<div className='w-full h-full max-w-7xl flex justify-end items-center p-5'>
							<Link to={preview.ref}>
								<Button>Download</Button>
							</Link>
						</div>
					</div>
					<div
						className='w-max flex justify-center items-center flex-col m-auto text-text'
						style={{ height: 'calc(100% - 60px)' }}
					>
						<div className='w-full h-ull grid place-items-center'>
							{preview.type.startsWith('image/') ? (
								<img src={preview.ref} className='max-w-[80vw] max-h-[80vh]' />
							) : (
								<span>File</span>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ChatMain;
