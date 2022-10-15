import { onAuthStateChanged } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import './App.css';
import Chat from './components/chat/chat.component';
import { AuthContext, AUTH_ACTION_TYPES } from './context/auth.context';

import {
	auth,
	googlePopup,
	logoutUser,
	signInWithEmail,
	signUp,
} from './utils/firebase/firebase.utils';

function App() {
	const { user, dispatch } = useContext(AuthContext);
	const [form, setForm] = useState({ email: '', password: '' });
	const { email, password } = form;

	const onChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};
	const onSignIn = async (e) => {
		e.preventDefault();
		setForm({ email: '', password: '' });
		await signInWithEmail(email, password);
	};

	const onSignUp = async (e) => {
		setForm({ email: '', password: '' });
		await signUp(email, password);
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			dispatch({ type: AUTH_ACTION_TYPES.LOGIN, payload: user });
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<>
			<div className='App' style={{ display: 'flex', flexFlow: 'column', gap: 20 }}>
				<nav>
					{user ? (
						<button onClick={logoutUser}>Logout</button>
					) : (
						<form>
							<label>Email</label>
							<input type='email' name='email' value={email} onChange={onChange} />
							<label>Password</label>
							<input type='password' name='password' value={password} onChange={onChange} />
							<button type='button' onClick={onSignUp}>
								Sign up
							</button>
							<button type='button' onClick={onSignIn}>
								Sign in
							</button>
							<button type='button' onClick={googlePopup}>
								Sign in with google
							</button>
						</form>
					)}
				</nav>
				{user && (
					<>
						<Chat />
					</>
				)}
			</div>
		</>
	);
}

export default App;
