import { getRedirectResult, signInWithRedirect } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import {
	auth,
	facebookProvider,
	googlePopup,
	googleProvider,
	setUser,
	signInWithEmail,
	signUp,
} from '../../utils/firebase/firebase.utils';
import { getError } from '../../utils/util';
import Button from '../button/button.component';
import Spinner from '../spinner/spinner.component';
import { AUTH_ERROR_TYPE } from '../../utils/firebase/firebase.utils';
import ParticleBackground from '../particle-background/particle-background.component';

const RegisterForm = () => {
	const [form, setForm] = useState({ email: '', password: '' });
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { email, password } = form;
	const navigate = useNavigate();

	const onChange = (e) => {
		const { name, value } = e.target;
		setError('');
		setForm({ ...form, [name]: value });
	};

	const onSignIn = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			setForm({ email: '', password: '' });
			const result = await signInWithEmail(email, password);
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
		document.title = 'Log In | MyChat';
		const getRedirect = async () => {
			try {
				const result = await getRedirectResult(auth);
				if (!result) return;
				const { user } = result;
				await setUser(user);
			} catch (error) {
				const message = getError(error.code);
				setError(message);
			}
		};
		getRedirect();
	}, []);

	return (
		<>
			<ParticleBackground />
			<div className='form-wrapper w-full h-full grid place-items-center'>
				<form
					className='flex flex-col max-w-xl m-auto p-5 gap-8 bg-[#222222e2] rounded-lg w-full justify-center sticky'
					onSubmit={onSignIn}
				>
					<div className='flex flex-col gap-2'>
						<h1 className='text-primary font-bold text-4xl'>Welcome to MyChat</h1>
						<h3 className='font-light text-text text-xl'>
							Don't have an account?{' '}
							<Link
								className='font-normal relative text-primary before:absolute before:transition-all before:w-full before:scale-0 before:hover:scale-100 before:h-[1.5px] before:top-full before:bg-primary'
								to='/register'
							>
								Register
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
							value={email}
							autoComplete='email'
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
					{error && (
						<div
							className={`text-center text-red-500 font-semibold text-lg border-2 rounded-lg py-2 border-red-500`}
						>
							{error}
						</div>
					)}
					<div className='flex flex-row gap-5 mt-2'>
						<Button type='submit' color='primary' className='text-lg' disabled={loading || error}>
							{loading ? <Spinner /> : 'Log in'}
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
