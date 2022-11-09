import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/auth.context';
import { ChatProvider } from './context/chat.context';
import { BrowserRouter } from 'react-router-dom';

if (process.env.NODE_ENV === 'production') {
	console.log(
		'%cWelcome to\n%c▒█▀▄▀█ █░░█ ▒█▀▀█ █░░█ █▀▀█ ▀▀█▀▀\n▒█▒█▒█ █▄▄█ ▒█░░░ █▀▀█ █▄▄█ ░░█░░\n▒█░░▒█ ▄▄▄█ ▒█▄▄█ ▀░░▀ ▀░░▀ ░░▀░░',
		'font-size: 20px;font-weight:bold;line-height:2',
		'font-size: 20px; color: #0092CA'
	);
}

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<ChatProvider>
					<App />
				</ChatProvider>
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>
);
