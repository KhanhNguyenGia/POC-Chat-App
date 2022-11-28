import { useContext, useEffect, useState } from 'react';
import { uuidv4 } from '@firebase/util';
import { AuthContext } from '../../context/auth.context';
import { sendMessage, uploadFiles } from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';
import { useParams } from 'react-router';
import { ChatContext } from '../../context/chat.context';
import { SendIcon, UploadIcon } from '../../assets/icon';
import { toast } from 'react-toastify';
import Spinner from '../spinner/spinner.component';

//{ message, onSendMessage, onChange, disabled, files, onRemove }
const MAX_SIZE = 1000000;

const FilePreviewRemoveIcon = ({ onRemove, index }) => (
	<div
		className='absolute w-7 h-7 -top-3 -right-3 bg-gray-500 rounded-full text-text text-lg font-bold leading-0 cursor-pointer hover:bg-red-500 flex justify-center items-center transition-all'
		onClick={() => onRemove(index)}
	>
		x
	</div>
);

const FilePreviewContainer = ({ file, index, onRemove, theme }) => {
	if (file.type.startsWith('image/')) {
		return (
			<div className='relative hover:opacity-80'>
				<FilePreviewRemoveIcon onRemove={onRemove} index={index} />
				<a href={file.url} className='text-text' onClick={(e) => e.stopPropagation()} download>
					<img
						className='block object-cover object-center rounded-lg w-[60px] h-[60px] shadow-xl'
						src={file.url}
						alt={file.name}
					/>
				</a>
			</div>
		);
	}
	return (
		<div
			className='h-[60px] rounded-lg px-3 py-2 grid place-items-center shadow-xl relative hover:opacity-80'
			style={{
				background: '#' + theme,
			}}
		>
			<FilePreviewRemoveIcon onRemove={onRemove} index={index} />
			<a href={file.url} className='text-text' onClick={(e) => e.stopPropagation()} download>
				{file.name}
			</a>
		</div>
	);
};

const ChatInput = () => {
	const { user } = useContext(AuthContext);
	const { theme } = useContext(ChatContext);
	const { chatId: chat } = useParams();
	const [files, setFiles] = useState([]);
	const [message, setMessage] = useState('');
	const [sending, setSending] = useState(false);
	const [isDragged, setIsDragged] = useState(false);

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
					uuid: file.uuid,
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

	const renderPreview = (file) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.addEventListener('load', (e) => {
			if (file.size > MAX_SIZE) {
				toast.error('File is too big');
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
	};

	const onDrop = (e) => {
		e.preventDefault();
		setIsDragged(false);
		if (e.dataTransfer) {
			[...e.dataTransfer.items].forEach((item, i) => {
				if (item.kind === 'file') {
					const file = item.getAsFile();
					renderPreview(file);
				}
			});
		}
	};

	const onManualUpload = (fileList) => {
		for (let file of fileList) {
			renderPreview(file);
		}
	};

	useEffect(() => {
		document.addEventListener('dragover', onDragOver);
		document.addEventListener('drop', onDrop);

		return () => {
			document.removeEventListener('dragover', onDragOver);
			document.removeEventListener('drop', onDrop);
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
						{files.map((file, index) => (
							<FilePreviewContainer
								file={file}
								index={index}
								onRemove={onRemove}
								key={index}
								theme={theme}
							/>
						))}
					</div>
				)}
				<div className='w-full flex justify-center items-center gap-3'>
					<label
						htmlFor='file-upload'
						className='h-full rounded-lg overflow-hidden w-10 cursor-pointer relative border-[2px] p-0.5 active:opacity-80 hover:opacity-80'
						style={{
							color: '#' + theme,
							borderColor: '#' + theme,
						}}
					>
						<UploadIcon className='block w-full h-full m-auto' />
						<input
							id='file-upload'
							name='file-upload'
							type='file'
							className='absolute h-0 w-0 opacity-0'
							multiple
							values={files}
							onChange={(e) => onManualUpload(e.target.files)}
						/>
					</label>
					<input
						onChange={onChange}
						value={message}
						className='w-full rounded-lg px-5 py-1 h-10 shadow-xl bg-gray-200 disabled:bg-slate-600'
						readOnly={sending}
						onPaste={(e) => onManualUpload(e.clipboardData.files)}
					/>
					<Button disabled={sending} onClick={onSendMessage} style={{ background: '#' + theme }}>
						{sending ? <Spinner size='w-6 h-6' /> : <SendIcon className='stroke-white stroke-2' />}
					</Button>
				</div>
			</form>
			{isDragged && (
				<div
					className='w-screen h-screen fixed top-0 left-0 bg-[#0009]'
					onClick={() => setIsDragged(false)}
				></div>
			)}
		</>
	);
};

export default ChatInput;
