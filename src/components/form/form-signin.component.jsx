import { useState } from 'react';
import { useNavigate } from 'react-router';
import { googlePopup, signInWithEmail, signUp } from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';

const SignInForm = () => {
	const [form, setForm] = useState({ email: '', password: '' });
	const { email, password } = form;
	const navigate = useNavigate();

	const onChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};
	const onSignIn = async (e) => {
		e.preventDefault();
		setForm({ email: '', password: '' });
		const result = await signInWithEmail(email, password);
		if (!result) return;
		navigate('/chat');
	};

	return (
		<form className='flex flex-col max-w-7xl m-auto p-5 gap-5 bg-layer rounded-lg w-full'>
			<label className='text-text font-bold text-2xl'>Email</label>
			<input
				className='px-5 py-2 rounded-md'
				type='email'
				name='email'
				value={email}
				onChange={onChange}
			/>
			<label className='text-text font-bold text-2xl'>Password</label>
			<input
				className='px-5 py-2 rounded-md'
				type='password'
				name='password'
				value={password}
				onChange={onChange}
			/>
			<div className='invisible'></div>
			<div className='flex flex-row gap-5'>
				<Button type='button' onClick={onSignIn} color='primary' className='text-lg'>
					Sign in
				</Button>
				<Button type='button' onClick={googlePopup} color='secondary' className='text-lg'>
					With Google
				</Button>
			</div>
			<div></div>
		</form>
	);
};

export default SignInForm;
