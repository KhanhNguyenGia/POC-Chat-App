import { useContext } from 'react';
import { ChatContext } from '../../context/chat.context';

const DEFAULT_STYLE = 'rounded-lg text-text px-3 py-2 max-w-full';

const ChatBubble = ({ current, children, belongsTo, same }) => {
	const { theme } = useContext(ChatContext);

	return (
		<div
			className={`max-w-[75%] w-max ${same ? 'mt-8 last:mt-0' : ''} ${
				current ? 'self-end' : `flex-col flex gap-3 ${!same ? 'pl-[52px]' : ''}`
			}`}
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
					className={DEFAULT_STYLE}
					style={{ wordWrap: 'break-word', background: current ? '#' + theme : '#333' }}
				>
					{children}
				</div>
			</div>
		</div>
	);
};

export default ChatBubble;
