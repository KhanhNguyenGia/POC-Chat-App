import { onAuthStateChanged } from 'firebase/auth';
import { useContext, useEffect, Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import './App.css';
import { AuthContext, AUTH_ACTION_TYPES } from './context/auth.context';
import { auth } from './utils/firebase/firebase.utils';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
// import NavBar from './components/nav/nav.component';
const NavBar = lazy(() => import('./components/nav/nav.component'));
//import Chat from './components/chat/chat.component';
const Chat = lazy(() => import('./components/chat/chat.component'));
// import { LogInForm, RegisterForm } from './components/form';
const LogInForm = lazy(() => import('./components/form/form-login.component'));
const RegisterForm = lazy(() => import('./components/form/form-register.component'));
import Spinner from './components/spinner/spinner.component';

TimeAgo.addDefaultLocale(en);

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
				<Suspense loading={<Spinner />}>
					<Routes>
						<Route path='/' element={<NavBar />}>
							<Route index element={user ? <Chat /> : <Navigate to='/login' />} />
							<Route path='/login' element={user ? <Navigate to='/' /> : <LogInForm />} />
							<Route path='/register' element={user ? <Navigate to='/' /> : <RegisterForm />} />
							<Route path='/:chatId' element={user ? <Chat /> : <Navigate to='/login' />} />
						</Route>
					</Routes>
				</Suspense>
			</div>
		</>
	);
}

export default App;
