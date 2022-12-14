import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ReactTimeAgo from 'react-time-ago';
import { toast } from 'react-toastify';
import { DeleteIcon, DocumentIcon, MoreIcon, ReplyIcon } from '../../assets/icon';
import { deleteMessage, removedFile } from '../../utils/firebase/firebase.utils';
import Avatar from '../avatar/avatar.component';
import Button from '../button/button.component';
import Overlay from '../overlay/overlay.component';
import Spinner from '../spinner/spinner.component';

const ChatBubbleOption = ({ children, ...rest }) => {
	return (
		<div
			className='hover:bg-action w-full px-3 py-2 cursor-pointer flex flex-row gap-3 active:opacity-80'
			{...rest}
		>
			{children}
		</div>
	);
};

const DeleteOverlay = ({ setDeleteOpen, messageId, filesIDs, removed }) => {
	const { chatId } = useParams();
	const [loading, setLoading] = useState(false);

	const onDelete = async () => {
		try {
			setLoading(true);
			await deleteMessage(chatId, messageId, removed);
			if (filesIDs) {
				await Promise.all(filesIDs.map((file) => removedFile(chatId, file)));
			}
			toast.success('Message has been deleted');
		} catch (error) {
			toast.error('Failed to delete files');
		}
		setLoading(false);
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
					{removed ? (
						<>
							<li>
								- This will <span className='text-red-500 font-semibold'>PERMANENTLY</span> removed
								the message from the chat.
							</li>
							<li>
								- This action is <span className='text-red-500 font-semibold'>IRREVERSIBLE</span>.
							</li>
						</>
					) : (
						<>
							<li>
								- Removing the message will remove it for{' '}
								<span className='text-red-500 font-semibold'>ALL</span> users in the chat.
							</li>
							<li>
								- Removed message <span className='text-red-500 font-semibold'>CAN NOT</span> be
								recovered.
							</li>
							<li>
								- <span className='text-red-500 font-semibold'>ALL</span> files will also be
								removed.
							</li>
						</>
					)}
				</ul>
				<div className='flex gap-5'>
					<Button
						color='primary'
						type='button'
						className='bg-red-600 disabled:bg-red-800'
						onClick={onDelete}
						disabled={loading}
					>
						{loading ? <Spinner size='w-7 h-7' /> : 'Delete'}
					</Button>
					<Button
						color='secondary'
						className='border-red-600 disabled:bg-transparent disabled:border-red-800'
						type='button'
						onClick={() => setDeleteOpen(false)}
						disabled={loading}
					>
						Cancel
					</Button>
				</div>
			</div>
		</Overlay>
	);
};

const DateOpen = ({ removedAt, sentAt, current }) => {
	// const today = Date.now();
	// const sentDate = new Date(sentAt);
	// const removeDate = removedAt ? new Date(removedAt) : null;
	return (
		<div
			className={`w-max absolute top-[calc(100%_+_10px)] flex flex-col gap-2 text-sm font-light text-gray-400 ${
				current ? 'right-0 text-right' : 'left-0 text-left'
			}`}
		>
			<div>
				Sent <ReactTimeAgo date={new Date(sentAt)} timeStyle='mini-minute-now' /> ago
			</div>
			{removedAt && (
				<div>
					Removed <ReactTimeAgo date={new Date(removedAt)} timeStyle='mini-minute-now' /> ago
				</div>
			)}
		</div>
	);
};

const BubbleMenu = ({ setOpen, current, open, onDelete, onCopy, removed }) => (
	<div
		onClick={(e) => e.stopPropagation()}
		onMouseEnter={() => setOpen(true)}
		onMouseLeave={() => setOpen(false)}
		className={`absolute top-1/2 -translate-y-1/2 transition-all duration-200 cursor-pointer ${
			open ? 'opacity-100 z-50' : 'opacity-0'
		} z-10 ${current ? 'right-[calc(100%_+_10px)]' : 'left-[calc(100%_+_10px)]'}`}
		style={{ fontStyle: 'normal' }}
	>
		<MoreIcon className='stroke-white cursor-pointer stroke-2' />
		{open && (
			<div
				className={`absolute bottom-[calc(100%_+_4px)] py-3 rounded-lg  ${
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
				{!removed && (
					<>
						<ChatBubbleOption>
							<ReplyIcon />
							Reply
						</ChatBubbleOption>
						<ChatBubbleOption onClick={onCopy}>
							<DocumentIcon />
							Copy
						</ChatBubbleOption>
					</>
				)}
			</div>
		)}
	</div>
);

const TOUCH_DURATION = 500;

const ChatBubble = ({ current, children, belongsTo, same, id, removedAt, sentAt }) => {
	// const { theme } = useContext(ChatContext);
	const [open, setOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [dateOpen, setDateOpen] = useState(false);
	let timer = null;

	const onCopy = () => {
		if (!navigator || !navigator.clipboard) {
			toast.error('Browser does not support clipboard');
			return;
		}
		if (!children[1]) {
			toast.info('Can not copy message with file');
			return;
		}
		navigator.clipboard.writeText(children[1].props.children);
		setOpen(false);
		toast.success('Copied to clipboard');
	};

	const onDelete = () => {
		setDeleteOpen(true);
		setOpen(false);
	};

	const touchStart = (e) => {
		if (!timer) {
			timer = setTimeout(onLongTouch, TOUCH_DURATION);
		}
	};

	const touchEnd = () => {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	};

	const onLongTouch = () => {
		timer = null;
		setOpen(true);
	};

	const onCloseMenuOption = () => {
		setOpen(false);
		setDateOpen(false);
	};

	useEffect(() => {
		document.addEventListener('click', onCloseMenuOption);
		return () => {
			document.removeEventListener('click', onCloseMenuOption);
		};
	}, []);

	return (
		<>
			<div
				className={`max-w-[75%] w-max relative select-none transition-all ${dateOpen && 'mb-16'} ${
					same ? 'mt-8 last:mt-0' : ''
				} ${current ? 'self-end' : `flex-col flex gap-3 ${!same ? 'pl-[52px]' : ''}`}`}
			>
				{same && !current && <div className='truncate text-text'>{belongsTo?.email}</div>}
				<div className='flex flex-row gap-3'>
					{!current && same && (
						<div className='self-end'>
							<Avatar members={[belongsTo]} avaSize={40} className='rounded-full overflow-hidden' />
						</div>
					)}
					<div
						className={`rounded-lg text-text max-w-full relative xs:select-text ${
							removedAt && 'italic text-[#ddd]'
						}`}
						style={{
							wordWrap: 'break-word',
						}}
						onTouchStart={touchStart}
						onTouchEnd={touchEnd}
						onClick={(e) => {
							e.stopPropagation();
							setDateOpen((prev) => !prev);
						}}
					>
						{dateOpen && <DateOpen removedAt={removedAt} sentAt={sentAt} current={current} />}
						{children}
						{(!removedAt || current) && (
							<BubbleMenu
								setOpen={setOpen}
								current={current}
								open={open}
								onDelete={onDelete}
								onCopy={onCopy}
								removed={removedAt}
							/>
						)}
					</div>
				</div>
			</div>
			{deleteOpen && (
				<DeleteOverlay
					setDeleteOpen={setDeleteOpen}
					messageId={id}
					filesIDs={children[0].props?.children.map((child) => child.props.uuid)}
					removed={removedAt}
				/>
			)}
		</>
	);
};

export default ChatBubble;
