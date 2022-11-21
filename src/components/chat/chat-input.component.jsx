import { useContext, useEffect, useRef, useState } from 'react';
import { uuidv4 } from '@firebase/util';
import { AuthContext } from '../../context/auth.context';
import { sendMessage, uploadFiles } from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';
import { useParams } from 'react-router';

//{ message, onSendMessage, onChange, disabled, files, onRemove }
const MAX_SIZE = 1000000;

const ChatInput = () => {
	const { user } = useContext(AuthContext);
	const { chatId: chat } = useParams();
	const [files, setFiles] = useState([]);
	const [message, setMessage] = useState('');
	const [sending, setSending] = useState(false);
	const [isDragged, setIsDragged] = useState(false);
	const inputRef = useRef();

	const onChange = (e) => {
		setMessage(e.target.value);
	};

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

	const onRemove = (index) => {
		setFiles((prev) => [...prev].filter((_, i) => i !== index));
	};

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

	useEffect(() => {
		if (sending) return;
		inputRef.current.focus();
	}, [sending]);

	useEffect(() => {
		document.addEventListener('dragover', onDragOver);
		document.addEventListener('drop', onDrop);
		document.addEventListener('click', onDrop);

		return () => {
			document.removeEventListener('dragover', onDragOver);
			document.removeEventListener('drop', onDrop);
			document.removeEventListener('click', onDrop);
		};
	}, []);

	return (
		<>
			<form
				className='rounded-lg w-full flex flex-col justify-center items-center gap-3'
				onSubmit={onSendMessage}
			>
				{!!files.length && (
					<div className='flex w-full gap-3'>
						{files.map((file, index) => {
							if (file.type.startsWith('image/')) {
								return (
									<img
										key={index}
										className='object-cover object-center rounded-lg w-[40px] h-[40px] shadow-xl'
										src={file.url}
										alt={file.name}
										onClick={() => onRemove(index)}
									/>
								);
							}
							return (
								<div
									key={index}
									className='h-[40px] rounded-lg bg-[#444] px-3 py-2 grid place-items-center shadow-xl'
									onClick={() => onRemove(index)}
								>
									<a href={file.url} className='text-text'>
										{file.name}
									</a>
								</div>
							);
						})}
					</div>
				)}
				<div className='w-full flex justify-center items-center gap-3'>
					<input
						onChange={onChange}
						value={message}
						className='w-full rounded-lg px-5 py-1 h-10 shadow-xl bg-gray-200 disabled:bg-slate-900'
						disabled={sending}
						ref={inputRef}
					/>
					<Button disabled={sending} onClick={onSendMessage}>
						Send
					</Button>
				</div>
			</form>
			{isDragged && <div className='w-screen h-screen absolute top-0 left-0 bg-[#0009]'></div>}
		</>
	);
};

export default ChatInput;
