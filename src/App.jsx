import { onAuthStateChanged } from 'firebase/auth';
import { useContext, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Link } from 'react-router-dom';
import './App.css';
import Button from './components/button/button.component';
import Chat from './components/chat/chat.component';
import { SignInForm } from './components/form';
import NavBar from './components/nav/nav.component';
import { AuthContext, AUTH_ACTION_TYPES } from './context/auth.context';

import { auth } from './utils/firebase/firebase.utils';

function App() {
	const { user, dispatch } = useContext(AuthContext);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			localStorage.setItem('user', JSON.stringify(user));
			dispatch({ type: AUTH_ACTION_TYPES.LOGIN, payload: user });
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<>
			<div className='App flex flex-col'>
				<Routes>
					<Route path='/' element={<NavBar />}>
						<Route index element={user ? <Chat /> : <Navigate to='/signin' />} />
						<Route path='/signin' element={user ? <Navigate to='/' /> : <SignInForm />} />
					</Route>
				</Routes>
			</div>
		</>
	);
}

export default App;
