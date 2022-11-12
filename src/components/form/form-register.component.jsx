import { getRedirectResult, signInWithRedirect } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import {
	auth,
	facebookProvider,
	googlePopup,
	googleProvider,
	signUp,
} from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';
import Spinner from '../spinner/spinner.component';
import { AUTH_ERROR_TYPE } from '../../utils/firebase/firebase.utils';
import { getError } from '../../utils/util';
import ParticleBackground from '../particle-background/particle-background.component';

const RegisterForm = () => {
	const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { email, password, confirmPassword } = form;
	const navigate = useNavigate();

	const onChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};
	const onSignUp = async (e) => {
		e.preventDefault();
		try {
			if (confirmPassword !== password) return;
			setLoading(true);
			setForm({ email: '', password: '', confirmPassword: '' });
			const result = await signUp(email, password);
			setLoading(false);
			if (!result) return;
			navigate('/');
		} catch (error) {
			const { code } = error;
			if (code === AUTH_ERROR_TYPE.USER_NOT_FOUND || code === AUTH_ERROR_TYPE.WRONG_PASSWORD) {
				setError('Incorrect email/password');
				setLoading(false);
				return;
			}
			const message = getError(code);
			setError(message);
			setLoading(false);
		}
	};

	const onRedirectSignIn = async (provider) => {
		setLoading(true);
		try {
			// googlePopup();
			signInWithRedirect(auth, provider);
			setLoading(false);
		} catch (error) {
			const message = getError(error.code);
			setError(message);
			setLoading(false);
		}
	};

	useEffect(() => {
		const getRedirect = async () => {
			try {
				const result = await getRedirectResult(auth);
			} catch (error) {
				const message = getError(error.code);
				setError(message);
			}
		};
		getRedirect();
	}, []);

	useEffect(() => {
		if (password !== confirmPassword) {
			setError(AUTH_ERROR_TYPE.PASSWORD_DO_NOT_MATCH);
		} else {
			setError('');
		}
	}, [password, confirmPassword]);

	return (
		<>
			<ParticleBackground />
			<div className='form-wrapper w-full h-full grid place-items-center'>
				<form
					className='flex flex-col max-w-xl m-auto p-5 gap-8 bg-[#222222e2] rounded-lg w-full justify-center sticky'
					onSubmit={onSignUp}
				>
					<div className='flex flex-col gap-2'>
						<h1 className='text-primary font-bold text-4xl'>Welcome to MyChat</h1>
						<h3 className='font-light text-text text-xl'>
							Already have an account?{' '}
							<Link
								className='font-normal relative text-primary before:absolute before:transition-all before:w-full before:scale-0 before:hover:scale-100 before:h-[1.5px] before:top-full before:bg-primary'
								to='/login'
							>
								Log in
							</Link>
						</h3>
					</div>
					<div className='flex flex-col gap-2'>
						<label className='text-text font-bold text-2xl' htmlFor='email'>
							Email
						</label>
						<input
							id='email'
							className='px-4 py-2 rounded-md'
							disabled={loading}
							type='email'
							name='email'
							autoComplete='email'
							value={email}
							onChange={onChange}
							required
							placeholder='example@email.com'
						/>
					</div>
					<div className='flex flex-col gap-2'>
						<label className='text-text font-bold text-2xl' htmlFor='password'>
							Password
						</label>
						<input
							id='password'
							className={`px-4 py-2 rounded-md border-2 ${
								error === AUTH_ERROR_TYPE.PASSWORD_DO_NOT_MATCH ? 'border-red-500' : ''
							}`}
							disabled={loading}
							type='password'
							name='password'
							autoComplete='password'
							value={password}
							onChange={onChange}
							required
							placeholder='super secret password'
						/>
					</div>
					<div className='flex flex-col gap-2'>
						<label className='text-text font-bold text-2xl' htmlFor='confirmPassword'>
							Confirm Password
						</label>
						<input
							id='confirmPassword'
							className={`px-4 py-2 rounded-md border-2 ${
								error === AUTH_ERROR_TYPE.PASSWORD_DO_NOT_MATCH ? 'border-red-500' : ''
							}`}
							disabled={loading}
							type='password'
							name='confirmPassword'
							autoComplete='confirm-password'
							value={confirmPassword}
							onChange={onChange}
							required
							placeholder='super secret password'
						/>
					</div>
					{error && (
						<div
							className={`text-center text-red-500 font-semibold text-lg border-2 rounded-lg py-2 border-red-500`}
						>
							{error}
						</div>
					)}
					<div className='flex flex-row gap-5 mt-2'>
						<Button type='submit' color='primary' className='text-lg' disabled={loading || error}>
							{loading ? <Spinner /> : 'Register'}
						</Button>
					</div>
					<div className='relative my-2 before:absolute before:block before:w-full before:h-[2px] before:bg-white before:rounded-full'>
						<div className='absolute bg-layer px-3 py-2 text-text font-semibold w-max -translate-x-1/2 -translate-y-1/2 left-1/2'>
							Or sign in with
						</div>
					</div>
					<div className='flex flex-row gap-5 justify-center items-center'>
						<Button
							type='button'
							onClick={() => onRedirectSignIn(googleProvider)}
							color='secondary'
							className='text-lg'
							disabled={loading}
						>
							<img
								src='/google.svg'
								width={30}
								height={30}
								className='m-auto'
								alt='sign in with google'
							/>
						</Button>
						<Button
							type='button'
							onClick={() => onRedirectSignIn(facebookProvider)}
							color='secondary'
							className='text-lg'
							disabled={loading}
						>
							<img
								src='/facebook.svg'
								width={30}
								height={30}
								className='m-auto'
								alt='sign in with facebook'
							/>
						</Button>
					</div>
				</form>
			</div>
		</>
	);
};

export default RegisterForm;
