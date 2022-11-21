import { useContext, useState } from 'react';
import { PencilIcon } from '../../assets/icon';
import { AuthContext } from '../../context/auth.context';
import Avatar from '../avatar/avatar.component';
import Button from '../button/button.component';

const BIG_IMAGE_SIZE = 320;

const Label = ({ children, ...rest }) => (
	<div className='text-gray-400 text-lg font-normal' {...rest}>
		{children}
	</div>
);

const Content = ({ children, ...rest }) => (
	<div className='text-xl font-semibold text-text' {...rest}>
		{children}
	</div>
);

const BasicInfoTab = () => {
	const { user } = useContext(AuthContext);
	const { uid, photoURL, displayName, email } = user;
	const [edit, setEdit] = useState(false);
	const [form, setForm] = useState({ email, displayName });
	const bigPhotoURL = photoURL?.replace('s96-c', `s${BIG_IMAGE_SIZE}-c`) || null;

	const onSubmit = (e) => {
		e.preventDefault();
		setEdit(false);
	};

	return (
		<main className='flex-[4] flex flex-col gap-5'>
			<Button className='w-max self-end' color='icon' onClick={() => setEdit(true)}>
				<PencilIcon />
			</Button>
			<form className='flex flex-col gap-5' onSubmit={onSubmit}>
				<div className='flex flex-col md:flex-row gap-10 items-center md:items-start'>
					<Avatar
						members={[{ ...user, photoURL: bigPhotoURL }]}
						avaSize={BIG_IMAGE_SIZE}
						className={`rounded-full overflow-hidden relative  before:absolute before:w-full before:h-full before:bg-black before:opacity-0 before:transition-all hover:before:opacity-30 cursor-pointer`}
					/>
					<div className='flex flex-col gap-5 flex-1 w-2/3'>
						<div className='flex flex-col gap-2'>
							<Label>Email</Label>
							{!edit ? (
								<Content>{email}</Content>
							) : (
								<input
									type='email'
									name='email'
									required
									value={form.email}
									className='px-3 rounded-lg font-semibold'
									placeholder={email}
								/>
							)}
						</div>
						<div className='flex flex-col gap-2 '>
							<Label>Display Name</Label>
							{!edit ? (
								<Content>{displayName || 'Create your own nickname'}</Content>
							) : (
								<input
									type='text'
									name='displayName'
									required
									value={form.displayName}
									className='px-3 rounded-lg font-semibold'
									placeholder={displayName || 'CoolName123'}
								/>
							)}
						</div>
					</div>
				</div>
				{edit && (
					<div className='sm:self-end w-1/2 md:w-1/3 flex flex-row gap-3 m-auto md:mx-0 mt-5'>
						<Button type='submit'>Save</Button>
						<Button
							type='button'
							color='secondary'
							onClick={() => {
								setEdit(false);
							}}
						>
							Cancel
						</Button>
					</div>
				)}
			</form>
		</main>
	);
};

export default BasicInfoTab;
