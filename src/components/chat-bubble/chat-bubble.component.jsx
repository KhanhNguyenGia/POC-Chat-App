const DEFAULT_STYLE = 'rounded-lg text-text px-3 py-2 w-max';

const ChatBubble = ({ current, children, belongsTo, same }) => {
	const STYLE = `${DEFAULT_STYLE} ${
		current ? 'bg-gradient-to-b from-[#2a80da] to-[#ea4aff]' : 'bg-layer'
	}`;

	return (
		<div
			className={`max-w-[75%] ${
				current ? 'self-end' : `flex-row flex gap-3 ${same ? 'pl-[52px]' : ''}`
			}`}
		>
			{!current && !same && (
				<div>
					<img
						src={belongsTo.photoURL}
						className='min-w-[40px] max-w-[40px] min-h-[40px] max-h-[40px] object-cover object-center rounded-full'
						alt={belongsTo.email}
					/>
				</div>
			)}
			<div className={STYLE} style={{ wordWrap: 'break-word' }}>
				{children}
			</div>
		</div>
	);
};

export default ChatBubble;
