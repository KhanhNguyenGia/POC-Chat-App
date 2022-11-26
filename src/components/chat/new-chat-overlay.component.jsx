import { debounce } from 'lodash';
import { useCallback, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/auth.context';
import {
	checkChatExists,
	createGroupChat,
	createNewChat,
	searchUser,
} from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';
import Overlay from '../overlay/overlay.component';

const NewChatOverlay = ({ setOpenNewChat }) => {
	const { user } = useContext(AuthContext);
	const [newSearch, setNewSearch] = useState('');
	const [found, setFound] = useState([]);
	const [users, setUsers] = useState([]);

	const onAddUser = (user) => {
		if (users.map((user) => user.uid).includes(user.uid)) return;
		setUsers((prev) => [...prev, user]);
	};

	const onNewSearch = (e) => {
		setNewSearch(e.target.value);
		onSearchDebounce(e.target.value);
	};

	const onSearch = async (value) => {
		const found = await searchUser(value, user.email);
		setFound(found);
	};

	const onSearchDebounce = useCallback(
		debounce((value) => onSearch(value), 300),
		[]
	);

	const onNewChat = async (other) => {
		if (!(await checkChatExists([user, other])) && user.email !== other.email) {
			await createNewChat(user, other);
			toast.success('Chat has been created');
		} else {
			toast.error('Chat already exists');
		}
		setFound([]);
		setUsers([]);
		setNewSearch('');
		setOpenNewChat(false);
	};

	const onNewGroupChat = async (other) => {
		const { displayName, uid, photoURL, email } = user;
		if (!(await checkChatExists([user, ...other])) && user.email !== other.email) {
			await createGroupChat([{ displayName, uid, email, photoURL }, ...other]);
		}
		setFound([]);
		setUsers([]);
		setNewSearch('');
		setOpenNewChat(false);
	};

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
		<Overlay onClick={() => setOpenNewChat(false)}>
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
		</Overlay>
	);
};

export default NewChatOverlay;
