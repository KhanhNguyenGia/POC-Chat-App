import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/auth.context';
import { ChatProvider } from './context/chat.context';
import { BrowserRouter } from 'react-router-dom';

if (process.env.NODE_ENV === 'production') {
	console.log(
		'▒█▀▄▀█ █░░█ ▒█▀▀█ █░░█ █▀▀█ ▀▀█▀▀\n▒█▒█▒█ █▄▄█ ▒█░░░ █▀▀█ █▄▄█ ░░█░░\n▒█░░▒█ ▄▄▄█ ▒█▄▄█ ▀░░▀ ▀░░▀ ░░▀░░'
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
