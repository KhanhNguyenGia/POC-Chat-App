import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/auth.context';
import { ChatContext } from '../../context/chat.context';
import {
	checkChatExists,
	createNewChat,
	db,
	searchUser,
	sendMessage,
	uploadFiles,
} from '../../utils/firebase/firebase.utils';
import ChatInput from '../chat-input/chat-input.component';
import ChatList from '../chat-list/chat-list.component';
import ChatMain from '../chat-main/chat-main.component';
import NewChatOverlay from '../new-chat-overlay/new-chat-overlay.component';
import { uuidv4 } from '@firebase/util';
import _, { debounce } from 'lodash';

const MAX_SIZE = 1000000;

const Chat = () => {
	const { chat } = useContext(ChatContext);
	const { user } = useContext(AuthContext);
	const [message, setMessage] = useState('');
	const [newChatId, setNewChatId] = useState('');
	const [sending, setSending] = useState(false);
	const [chats, setChats] = useState([]);
	const [openNewChat, setOpenNewChat] = useState(false);
	const [isDragged, setIsDragged] = useState(false);
	const [files, setFiles] = useState([]);
	const [found, setFound] = useState([]);

	const onNewChatId = (e) => {
		setNewChatId(e.target.value);
		onSearchDebounce(e.target.value);
	};

	const onChange = (e) => {
		setMessage(e.target.value);
	};

	const onSearch = async (value) => {
		const found = await searchUser(value);
		setFound(found);
	};

	const onSearchDebounce = useCallback(
		debounce((value) => onSearch(value), 500),
		[]
	);

	const onSendMessage = async (e) => {
		e.preventDefault();
		if (!user) return;
		setSending(true);
		const { uid } = user;
		const fileRefs =
			files.length &&
			(await Promise.all(
				files.map(async (file) => ({
					name: file.name,
					type: file.type,
					ref: await uploadFiles(chat, file),
				}))
			));
		const fileURL =
			fileRefs.length &&
			fileRefs.map((fileRef) => ({
				...fileRef,
				ref: `https://firebasestorage.googleapis.com/v0/b/poc-chat-app-6da8c.appspot.com/o/${encodeURIComponent(
					fileRef.ref.ref.fullPath
				)}?alt=media`,
			}));
		await sendMessage(message, fileURL, uid, chat);
		setMessage('');
		setFiles([]);
		setSending(false);
	};

	const onNewChat = async (newChat) => {
		if (!(await checkChatExists(user.email, newChat)) && user.email !== newChat) {
			await createNewChat(user, newChat);
		}
		setFound([]);
		setNewChatId('');
		setOpenNewChat(false);
	};

	const onRemove = (index) => {
		setFiles((prev) => [...prev].filter((_, i) => i !== index));
	};

	useEffect(() => {
		const unsubscribeFromChatList = onSnapshot(
			query(collection(db, `/chats`), where('membersId', 'array-contains', `${user.email}`)),
			(docs) => {
				setChats(
					docs.docs.map((doc) => ({
						...doc.data(),
						id: doc.id,
					}))
				);
			}
		);

		const onDragOver = (e) => {
			e.preventDefault();
			setIsDragged(true);
		};

		const onDrop = (e) => {
			e.preventDefault();
			setIsDragged(false);
			if (e.dataTransfer) {
				[...e.dataTransfer.items].forEach((item, i) => {
					if (item.kind === 'file') {
						const file = item.getAsFile();
						const reader = new FileReader();
						reader.readAsDataURL(file);
						reader.addEventListener('load', () => {
							if (file.size > MAX_SIZE) {
								alert('file is too big');
								return;
							}
							setFiles((prev) => [
								...prev,
								{
									uuid: uuidv4() + '.' + file.name.split('.').pop(),
									name: file.name,
									type: file.type,
									url: reader.result,
									file: file,
								},
							]);
						});
					}
				});
			}
		};

		document.addEventListener('dragover', onDragOver);
		document.addEventListener('drop', onDrop);
		document.addEventListener('click', onDrop);

		return () => {
			unsubscribeFromChatList();
			document.removeEventListener('dragover', onDragOver);
			document.removeEventListener('drop', onDrop);
			document.removeEventListener('click', onDrop);
		};
	}, []);

	return (
		<>
			<main style={{ maxWidth: 1280, marginInline: 'auto', width: '100%', padding: 20 }}>
				<div style={{ display: 'flex', gap: 20 }}>
					<ChatList onNewChat={setOpenNewChat} chats={chats} />
					<div
						style={{
							flex: 3,
							height: '700px',
							background: '#222',
							display: 'flex',
							justifyContent: 'center',
							flexFlow: 'column',
							alignItems: 'center',
							margin: 'auto',
							borderRadius: 4,
							overflow: 'auto',
							padding: 20,
							gap: 10,
						}}
					>
						{chat && (
							<>
								<ChatMain chat={chat} />
								<ChatInput
									message={message}
									onChange={onChange}
									onSendMessage={onSendMessage}
									disabled={sending}
									files={files}
									onRemove={onRemove}
								/>
							</>
						)}
					</div>
				</div>
			</main>
			{openNewChat && (
				<NewChatOverlay
					newChatId={newChatId}
					onNewChatId={onNewChatId}
					setOpenNewChat={setOpenNewChat}
					onNewChat={onNewChat}
					found={found}
				/>
			)}
			{isDragged && (
				<div
					style={{
						width: '100vw',
						height: '100vh',
						position: 'absolute',
						top: 0,
						left: 0,
						background: '#0009',
					}}
				></div>
			)}
		</>
	);
};

export default Chat;
