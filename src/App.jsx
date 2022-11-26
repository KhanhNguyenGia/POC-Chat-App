import { onAuthStateChanged } from 'firebase/auth';
import { useContext, useEffect, Suspense, lazy, useState } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router';
import './App.css';
import { AuthContext, AUTH_ACTION_TYPES } from './context/auth.context';
import { auth, checkChatValid, getChatInfo } from './utils/firebase/firebase.utils';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
const NavBar = lazy(() => import('./components/nav/nav.component'));
const Chat = lazy(() => import('./components/chat/chat.component'));
const LogInForm = lazy(() => import('./components/form/form-login.component'));
const RegisterForm = lazy(() => import('./components/form/form-register.component'));
import Spinner from './components/spinner/spinner.component';
import { ChatProvider } from './context/chat.context';
const ChatHeader = lazy(() => import('./components/chat/chat-header.component'));
const ChatMain = lazy(() => import('./components/chat/chat-main.component'));
const ChatInput = lazy(() => import('./components/chat/chat-input.component'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
// import { BasicInfoTab } from './components/profile-page';
const BasicInfoTab = lazy(() => import('./components/profile-page/basic-info-tab.component'));
const SettingTab = lazy(() => import('./components/profile-page/setting-tab.component'));

TimeAgo.addDefaultLocale(en);

const ChatGuard = () => {
	const { chatId } = useParams();
	const { user } = useContext(AuthContext);
	const [chatValid, setChatValid] = useState(undefined);

	useEffect(() => {
		const checkChat = async () => {
			const result = await checkChatValid(chatId, user.uid);
			setChatValid(result);
		};
		checkChat();
	}, []);

	if (chatValid === undefined) {
		return <Spinner />;
	}
	if (!chatValid) return <Navigate to='/chat' />;
	return (
		<ChatProvider>
			<ChatHeader />
			<ChatMain chat={chatId} />
			<ChatInput />
		</ChatProvider>
	);
};

const AuthGuard = ({ auth, unAuth }) => {
	const { user } = useContext(AuthContext);
	if (!user) {
		return unAuth;
	}
	return auth;
};

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
				</Suspense>
			</div>
		</>
	);
}

export default App;
