import { onAuthStateChanged } from 'firebase/auth';
import { useContext, useEffect, Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { AuthContext, AUTH_ACTION_TYPES } from './context/auth.context';
import { auth } from './utils/firebase/firebase.utils';
import TimeAgo from 'javascript-time-ago';
import { ToastContainer } from 'react-toastify';
import en from 'javascript-time-ago/locale/en';
import Spinner from './components/spinner/spinner.component';
import Overlay from './components/overlay/overlay.component';
const NavBar = lazy(() => import('./components/nav/nav.component'));
const Chat = lazy(() => import('./components/chat/chat.component'));
const LogInForm = lazy(() => import('./components/form/form-login.component'));
const RegisterForm = lazy(() => import('./components/form/form-register.component'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const BasicInfoTab = lazy(() => import('./components/profile-page/basic-info-tab.component'));
const SettingTab = lazy(() => import('./components/profile-page/setting-tab.component'));
const ChatGuard = lazy(() => import('./routers/ChatGuard'));
const AuthGuard = lazy(() => import('./routers/AuthGuard'));

import './App.css';
import 'react-toastify/dist/ReactToastify.min.css';

TimeAgo.addDefaultLocale(en);

function App() {
	const { dispatch } = useContext(AuthContext);

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
		<Suspense
			fallback={
				<Overlay>
					<Spinner />
				</Overlay>
			}
		>
			<div className='App flex flex-col'>
				<Routes>
					<Route path='/' element={<NavBar />}>
						<Route index element={<HomePage />} />
						<Route
							path='/login'
							element={<AuthGuard auth={<Navigate to='/' />} unAuth={<LogInForm />} />}
						/>
						<Route
							path='/register'
							element={<AuthGuard auth={<Navigate to='/' />} unAuth={<RegisterForm />} />}
						/>
						<Route
							path='/chat'
							element={<AuthGuard auth={<Chat />} unAuth={<Navigate to='/login' />} />}
						>
							<Route
								index
								element={
									<div className='text-text font-semibold text-2xl h-max m-auto'>
										Choose a conversation
									</div>
								}
							/>
							<Route path=':chatId' element={<ChatGuard />} />
						</Route>
						<Route
							path='/profile'
							element={<AuthGuard auth={<ProfilePage />} unAuth={<Navigate to='/' />} />}
						>
							<Route index element={<BasicInfoTab />} />
							<Route path='settings' element={<SettingTab />} />
						</Route>
						<Route path='*' element={<ErrorPage code={404} />} />
					</Route>
				</Routes>
				<ToastContainer
					position='top-right'
					autoClose={4000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss={false}
					draggable
					pauseOnHover={false}
					theme='dark'
				/>
			</div>
		</Suspense>
	);
}

export default App;
