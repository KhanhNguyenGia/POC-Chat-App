const DEFAULT_STYLE = 'rounded-lg text-text px-3 py-2';

const ChatBubble = ({ current, children, belongsTo, same }) => {
	const STYLE = `${DEFAULT_STYLE} ${current ? 'bg-primary' : 'bg-layer max-w-full'}`;

	return (
		<div
			className={`max-w-[75%] ${
				current ? 'self-end' : `flex-row flex gap-3 ${same ? 'pl-[52px]' : ''}`
			}`}
		>
			{!current && !same && (
				<div>
					{belongsTo?.photoURL ? (
						<img
							src={belongsTo?.photoURL}
							className='min-w-[40px] max-w-[40px] min-h-[40px] max-h-[40px] object-cover object-center rounded-full'
							alt={belongsTo?.email}
						/>
					) : (
						<div className='min-w-[40px] max-w-[40px] min-h-[40px] max-h-[40px] object-cover object-center rounded-full bg-action text-text font-medium text-2xl flex justify-center items-center'>
							{belongsTo?.email.charAt(0).toUpperCase()}
						</div>
					)}
				</div>
			)}
			<div className={STYLE} style={{ wordWrap: 'break-word' }}>
				{children}
			</div>
		</div>
	);
};

export default ChatBubble;
