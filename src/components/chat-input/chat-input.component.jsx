import Button from '../button/button.component';

const ChatInput = ({ message, onSendMessage, onChange, disabled, files, onRemove }) => {
	return (
		<form
			className='bg-[#333] rounded-lg w-full flex flex-col justify-center items-center gap-3 p-3'
			onSubmit={onSendMessage}
		>
			{!!files.length && (
				<div className='flex w-full gap-3'>
					{files.map((file, index) => {
						if (file.type.startsWith('image/')) {
							return (
								<img
									key={index}
									className='object-cover object-center rounded-lg w-[40px] h-[40px]'
									src={file.url}
									alt={file.name}
									onClick={() => onRemove(index)}
								/>
							);
						}
						return (
							<div
								key={index}
								className='h-[40px] rounded-lg bg-[#444] px-3 py-2 grid place-items-center'
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
				<input onChange={onChange} value={message} className='w-full rounded-lg px-5 py-1 h-10' />
				<Button disabled={disabled} onClick={onSendMessage}>
					Send
				</Button>
			</div>
		</form>
	);
};

export default ChatInput;
