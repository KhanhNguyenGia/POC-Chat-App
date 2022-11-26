import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { ZoomInIcon, ZoomOutIcon } from '../../assets/icon';
// import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';
import { ChatContext } from '../../context/chat.context';
// import { ChatContext } from '../../context/chat.context';
import { db, getChatMembers } from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';
import ChatBubble from './chat-bubble.component';

const ChatMain = ({ chat }) => {
	// const { chatId: chat } = useParams();
	const { theme } = useContext(ChatContext);
	const [messages, setMessages] = useState([]);
	const { user } = useContext(AuthContext);
	const [members, setMembers] = useState([]);
	const [preview, setPreview] = useState(null);

	// Add onzoom with maxzoom of 3x
	const onZoomIn = (e) => {
		e.stopPropagation();
		const ref = document.querySelector('#preview-image');
		const scale = ref.style.transform ? +ref.style.transform.slice(6, -1) + 0.1 : 1.1;
		if (scale > 1.5) return;
		ref.style.transform = `scale(${scale})`;
	};

	//onZoomout with minzoom of 0.5
	const onZoomOut = (e) => {
		e.stopPropagation();
		const ref = document.querySelector('#preview-image');
		const scale = ref.style.transform ? +ref.style.transform.slice(6, -1) - 0.1 : 0.9;
		if (scale < 0.5) return;
		ref.style.transform = `scale(${scale})`;
	};

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
			<div className='chat__main bg-layer2 w-full rounded-lg flex flex-col-reverse mt-auto p-3 gap-2 overflow-auto h-full max-h-full shadow-xl'>
				{!!messages.length ? (
					messages?.map(({ id, uid, content, fileURL }, index) => (
						<ChatBubble
							key={id}
							current={uid === user.uid}
							belongsTo={members.find((member) => member.uid === uid)}
							same={
								(index !== messages.length - 1 &&
									messages[index].uid !== messages[index + 1].uid) ||
								index === messages.length - 1
							}
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
			{preview && (
				<div
					className='w-screen h-screen absolute top-0 left-0 bg-[#0009] z-20 overflow-hidden'
					onClick={() => setPreview(null)}
				>
					<div className='w-full h-[60px] bg-layer' onClick={(e) => e.stopPropagation()}>
						<div className='w-full h-full max-w-7xl flex justify-between items-center p-5'>
							<div className='flex flex-row gap-5'>
								<Button color='icon' onClick={onZoomOut}>
									<ZoomOutIcon />
								</Button>
								<Button color='icon' onClick={onZoomIn}>
									<ZoomInIcon />
								</Button>
							</div>
							<a href={preview.ref} target='_blank' download>
								<Button style={{ background: '#' + theme }}>Download</Button>
							</a>
						</div>
					</div>
					<div
						className='w-max flex justify-center items-center flex-col m-auto text-text '
						style={{ height: 'calc(100% - 60px)' }}
					>
						<div className='w-full h-ull grid place-items-center'>
							{preview.type.startsWith('image/') ? (
								<div
									className='flex flex-col items-center justify-center gap-10'
									onClick={(e) => e.stopPropagation()}
								>
									<img src={preview.ref} className='max-w-[70vw] max-h-[70vh]' id='preview-image' />
								</div>
							) : (
								<div
									className='flex flex-col gap-3 items-center font-medium text-xl'
									onClick={(e) => e.stopPropagation()}
								>
									<div>File name: {preview.name}</div>
									<div>Preview is not available</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ChatMain;
