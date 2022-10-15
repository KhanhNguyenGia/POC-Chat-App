const NewChatOverlay = ({ setOpenNewChat, onNewChatId, newChatId, onNewChat, found }) => {
	return (
		<div
			style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				width: '100vw',
				height: '100vh',
				transform: 'translate(-50%, -50%)',
				background: '#222a',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
			onClick={() => setOpenNewChat(false)}
		>
			<form
				style={{
					background: '#222',
					padding: 10,
					borderRadius: 4,
					display: 'flex',
					flexFlow: 'column',
					alignItems: 'center',
					gap: 20,
					color: '#fff',
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<label>New chat ID</label>
				<input value={newChatId} onChange={onNewChatId} />
				{!!found?.length && (
					<div style={{ display: 'flex', flexFlow: 'column', gap: 10 }}>
						{found.map((_) => (
							<button
								key={_.email}
								type='button'
								onClick={() => onNewChat(_.email)}
								style={{ background: '#fff', padding: '8px 12px', cursor: 'pointer' }}
							>
								{_.email}
							</button>
						))}
					</div>
				)}
			</form>
		</div>
	);
};

export default NewChatOverlay;
