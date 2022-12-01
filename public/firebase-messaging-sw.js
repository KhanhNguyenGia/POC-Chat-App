// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
	apiKey: 'AIzaSyBWdfeN1kOntlt7JIGjVaCgzCPNdP0mM1M',
	authDomain: 'poc-chat-app-6da8c.firebaseapp.com',
	projectId: 'poc-chat-app-6da8c',
	storageBucket: 'poc-chat-app-6da8c.appspot.com',
	messagingSenderId: '228297410990',
	appId: '1:228297410990:web:0f57004f2ad82e9acee03f',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
	console.log('Received background message ', payload);

	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body,
		icon: 'https://mychat-rt.vercel.app/favicon.ico',
		badge: 'https://mychat-rt.vercel.app/favicon.ico',
		timestamp: Date.now(),
		vibrate: [200, 100, 200, 100, 200, 100, 200],
	};

	self.registration.showNotification(notificationTitle, notificationOptions);
});
