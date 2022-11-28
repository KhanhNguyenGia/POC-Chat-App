import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { DocumentIcon, DownArrowIcon, ZoomInIcon, ZoomOutIcon } from '../../assets/icon';
import { AuthContext } from '../../context/auth.context';
import { ChatContext } from '../../context/chat.context';
import useChatMessage from '../../hooks/useChatMessage.hook';
import { db, getChatMembers } from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';
import Overlay from '../overlay/overlay.component';
import ChatBubble from './chat-bubble.component';

const FileContainer = ({ file, setPreview, theme, current }) => {
	if (file.type.startsWith('image/'))
		return (
			<img
				uuid={file.uuid}
				key={file.ref}
				src={file.ref}
				alt='user image'
				className='object-cover object-center max-h-[200px] min-w-[200px] hover:opacity-80 rounded-lg flex-1 bg-layer3'
				style={{ borderColor: '#' + theme }}
				onClick={() => setPreview({ ref: file.ref, type: file.type, name: file.name })}
			/>
		);
	return (
		<div
			uuid={file.uuid}
			key={file.ref}
			className='rounded-lg px-4 py-3 flex gap-3 items-center justify-center flex-1'
			onClick={() => setPreview({ ref: file.ref, type: file.type, name: file.name })}
			style={{
				background: current ? '#' + theme : '#333',
			}}
		>
			<DocumentIcon />
			<span href={file.ref} className='text-text cursor-pointer'>
				{file.name}
			</span>
		</div>
	);
};

const DownloadOverlay = ({ setPreview, theme, preview }) => {
	// Add onzoom with maxzoom of 1.5x
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

	return (
		<Overlay onClick={() => setPreview(null)}>
			<div className='w-full h-full'>
				<div className='w-full h-[60px] fixed bg-[#000a]' onClick={(e) => e.stopPropagation()}>
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
				<div className='w-max flex justify-center items-center flex-col m-auto text-text h-full'>
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
		</Overlay>
	);
};

const ChatMain = () => {
	const { theme } = useContext(ChatContext);
	// const [messages, setMessages] = useState([]);
	const { user } = useContext(AuthContext);
	// const [members, setMembers] = useState([]);
	const [preview, setPreview] = useState(null);
	const { loading, members, messages } = useChatMessage();
	const [showToBottom, setShowToBottom] = useState(false);

	const onScroll = (e) => {
		if (e.target.scrollTop < 0) {
			setShowToBottom(true);
			return;
		}
		setShowToBottom(false);
	};

	const scrollToBottom = () => {
		const main = document.querySelector('.chat__main');
		main?.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return (
		<>
			<div
				className='chat__main bg-layer2 w-full rounded-lg flex flex-col-reverse mt-auto p-3 gap-2 overflow-auto h-full max-h-full shadow-xl transition-all relative'
				onScroll={onScroll}
			>
				{loading ? null : messages.length ? (
					<>
						{messages?.map(({ id, uid, content, fileURL, removedAt, sent }, index) => {
							const current = uid === user.uid;
							return (
								<ChatBubble
									key={id}
									id={id}
									sentAt={sent}
									current={current}
									belongsTo={members.find((member) => member.uid === uid)}
									same={
										(index !== messages.length - 1 &&
											messages[index].uid !== messages[index + 1].uid) ||
										index === messages.length - 1
									}
									removedAt={removedAt}
								>
									{!!fileURL?.length && (
										<div className='flex cursor-pointer justify-end flex-wrap mb-1 gap-1'>
											{fileURL.map((file) => (
												<FileContainer
													key={file.uuid}
													file={file}
													setPreview={setPreview}
													theme={theme}
													current={current}
												/>
											))}
										</div>
									)}
									{content && (
										<div
											className={`px-3 py-2 rounded-lg w-max max-w-[100%] break-words ${
												current && 'ml-auto'
											}`}
											style={{
												background: current ? '#' + theme : '#333',
											}}
										>
											{content}
										</div>
									)}
								</ChatBubble>
							);
						})}
					</>
				) : (
					<div className='w-full h-[100px] text-text grid place-items-center'>
						<div>Start the conversation by saying "Hi!"</div>
					</div>
				)}
			</div>
			{showToBottom && (
				<div
					className='fixed bg-layer p-2 rounded-full right-1/2 -translate-x-1/2 xs:right-[38%] bottom-20 xs:bottom-24 animate-bounce cursor-pointer shadow-xl'
					onClick={scrollToBottom}
				>
					<DownArrowIcon
						className='stroke-2'
						style={{
							stroke: '#' + theme,
						}}
					/>
				</div>
			)}
			{preview && <DownloadOverlay preview={preview} setPreview={setPreview} theme={theme} />}
		</>
	);
};

export default ChatMain;
