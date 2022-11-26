import { useContext, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { DeleteIcon, DocumentIcon, MoreIcon, ReplyIcon } from '../../assets/icon';
import { ChatContext } from '../../context/chat.context';
import { deleteMessage, removedFile } from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';
import Overlay from '../overlay/overlay.component';

const ChatBubbleOption = ({ children, ...rest }) => {
	return (
		<div className='hover:bg-action w-full px-3 py-2 cursor-pointer flex flex-row gap-3' {...rest}>
			{children}
		</div>
	);
};

const DeleteOverlay = ({ setDeleteOpen, messageId, filesIDs }) => {
	const { chatId } = useParams();

	const onDelete = async () => {
		try {
			await deleteMessage(chatId, messageId);
			if (filesIDs) {
				await Promise.all(filesIDs.map((file) => removedFile(chatId, file)));
			}
			toast.success('Message has been deleted');
		} catch (error) {
			toast.error('Failed to delete files');
		}
		setDeleteOpen(false);
	};

	return (
		<Overlay onClick={() => setDeleteOpen(false)}>
			<div
				className='bg-layer px-4 py-3 flex flex-col gap-5 rounded-lg z-10 max-w-[min(80%,360px)] text-text'
				onClick={(e) => e.stopPropagation()}
			>
				<div className='font-bold text-2xl text-center'>
					Are you sure you want to remove the message?
				</div>
				<ul className='text-slate-300 border-2 border-slate-500 border-opacity-30 rounded-lg py-2 px-3 flex flex-col gap-3'>
					<li>- Removing the message will remove it for all users in the chat.</li>
					<li>- Removed message can not be recovered.</li>
				</ul>
				<div className='flex gap-5'>
					<Button color='primary' type='button' className='bg-red-600' onClick={onDelete}>
						Confirm
					</Button>
					<Button
						color='secondary'
						className='border-red-600'
						type='button'
						onClick={() => setDeleteOpen(false)}
					>
						Cancel
					</Button>
				</div>
			</div>
		</Overlay>
	);
};

const ChatBubble = ({ current, children, belongsTo, same, id }) => {
	const { theme } = useContext(ChatContext);
	const [open, setOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const removed = children[1] === 'Message removed';

	const onCopy = () => {
		if (!navigator || !navigator.clipboard) {
			toast.error('Browser does not support clipboard');
			return;
		}
		if (!children[1]) {
			toast.info('Can not copy image file');
			return;
		}
		navigator.clipboard.writeText(children[1]);
		setOpen(false);
		toast.success('Copied to clipboard');
	};

	const onDelete = () => {
		setDeleteOpen(true);
		setOpen(false);
	};

	return (
		<>
			<div
				className={`max-w-[75%] w-max ${same ? 'mt-8 last:mt-0' : ''} ${
					current ? 'self-end' : `flex-col flex gap-3 ${!same ? 'pl-[52px]' : ''}`
				} relative`}
			>
				{same && !current && <div className='truncate text-text'>{belongsTo?.email}</div>}
				<div className='flex flex-row gap-3'>
					{!current && same && (
						<div className='self-end'>
							{belongsTo?.photoURL ? (
								<img
									src={belongsTo?.photoURL}
									className='min-w-[40px] max-w-[40px] min-h-[40px] max-h-[40px] object-cover object-center rounded-full'
									alt={belongsTo?.email}
								/>
							) : (
								<div className='min-w-[40px] max-w-[40px] min-h-[40px] max-h-[40px] object-cover object-center rounded-full bg-slate-500 text-text font-medium text-2xl flex justify-center items-center'>
									{belongsTo?.email.charAt(0).toUpperCase()}
								</div>
							)}
						</div>
					)}
					<div
						className={`rounded-lg text-text px-3 py-2 max-w-full relative ${
							removed && 'italic text-[#bbb]'
						}`}
						style={{
							wordWrap: 'break-word',
							background: current ? '#' + theme : '#333',
						}}
					>
						{children}
						{!removed && (
							<div
								onMouseEnter={() => setOpen(true)}
								onMouseLeave={() => setOpen(false)}
								className={`absolute top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 z-10 ${
									current ? 'right-[calc(100%_+_10px)]' : 'left-[calc(100%_+_10px)]'
								}`}
								style={{ fontStyle: 'normal' }}
							>
								<MoreIcon className='stroke-white cursor-pointer stroke-2' />
								{open && (
									<div
										className={`absolute bottom-[calc(100%_+_10px)] py-3 rounded-lg  ${
											current
												? '-right-[200%] before:-translate-x-1/2  before:left-1/2'
												: '-left-[150%] before:right-1/2 before:translate-x-1/2'
										} bg-layer3 text-text w-max before:absolute before:top-full before:border-transparent before:border-[12px] before:border-t-layer3 flex flex-col gap-3 shadow-xl`}
									>
										{current && (
											<ChatBubbleOption onClick={onDelete}>
												<DeleteIcon />
												Remove
											</ChatBubbleOption>
										)}
										<ChatBubbleOption>
											<ReplyIcon />
											Reply
										</ChatBubbleOption>
										<ChatBubbleOption onClick={onCopy}>
											<DocumentIcon />
											Copy
										</ChatBubbleOption>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
			{deleteOpen && (
				<DeleteOverlay
					setDeleteOpen={setDeleteOpen}
					messageId={id}
					filesIDs={children[0].props?.children.map((child) => child.props.uuid)}
				/>
			)}
		</>
	);
};

export default ChatBubble;
