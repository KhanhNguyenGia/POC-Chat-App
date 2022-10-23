import { useState } from 'react';
import Button from '../button/button.component';

const NewChatOverlay = ({
	setOpenNewChat,
	onNewSearch,
	newSearch,
	found,
	users,
	onAddUser,
	onNewGroupChat,
	setUsers,
	onNewChat,
}) => {
	const onSubmit = (e) => {
		e.preventDefault();
		if (!users.length) {
			return;
		}
		if (users.length === 1) {
			onNewChat(users[0]);
			return;
		}
		onNewGroupChat(users);
	};
	return (
		<div
			className='absolute top-1/2 left-1/2 w-screen h-screen -translate-x-1/2 -translate-y-1/2 bg-[#0009] flex justify-center items-center'
			onClick={() => setOpenNewChat(false)}
		>
			<form
				className='bg-layer p-5 rounded-lg flex flex-col items-center gap-5 text-text'
				onClick={(e) => e.stopPropagation()}
				onSubmit={onSubmit}
			>
				<div className='flex flex-row gap-5 justify-center items-center'>
					<label className='font-bold text-lg'>New chat</label>
					<Button color='primary' type='submit'>
						Create
					</Button>
				</div>
				<input
					id='search-user'
					value={newSearch}
					onChange={onNewSearch}
					className='text-[#000] px-4 py-2 rounded-lg'
					placeholder='abc@gmail.com'
				/>
				<div className='flex flex-row gap-2 max-w-[90%] justify-center items-center'>
					{users.map((user) => (
						<Button
							onClick={() => setUsers((prev) => prev.filter((_) => _.uid != user.uid))}
							key={user.uid}
						>
							{user.email.split('@')[0]}
						</Button>
					))}
				</div>
				{!!found?.length && (
					<div className='flex flex-col gap-3'>
						{found.map((user) => (
							<Button
								key={user.email}
								type='button'
								onClick={() => onAddUser(user)}
								className='bg-secondary text-text px-5 py-3 rounded-lg'
							>
								{user.email}
							</Button>
						))}
					</div>
				)}
			</form>
		</div>
	);
};

export default NewChatOverlay;
