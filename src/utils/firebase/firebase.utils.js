import { initializeApp } from 'firebase/app';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	query,
	setDoc,
	where,
} from 'firebase/firestore';
import {
	getAuth,
	signInWithPopup,
	signOut,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyBWdfeN1kOntlt7JIGjVaCgzCPNdP0mM1M',
	authDomain: 'poc-chat-app-6da8c.firebaseapp.com',
	projectId: 'poc-chat-app-6da8c',
	storageBucket: 'poc-chat-app-6da8c.appspot.com',
	messagingSenderId: '228297410990',
	appId: '1:228297410990:web:0f57004f2ad82e9acee03f',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export const googlePopup = async () => {
	try {
		const { user } = await signInWithPopup(auth, googleProvider);
		const userRef = doc(db, `/users/${user.email}`);
		const { uid, email } = user;
		const userDoc = await getDoc(userRef);
		if (userDoc.exists()) return;
		await setDoc(userRef, { uid, email });
	} catch (e) {
		console.log(e);
	}
};

export const signInWithEmail = async (email, password) => {
	if (!email || !password) return;
	try {
		const { user } = await signInWithEmailAndPassword(auth, email, password);
		const userRef = doc(db, `/users/${user.email}`);
		const userDoc = await getDoc(userRef);
		if (userDoc.exists()) return;
		await setDoc(userRef, { uid: user.uid, email: user.email });
	} catch (e) {
		console.log(e);
	}
};

export const signUp = async (email, password) => {
	if (!email || !password) return;
	try {
		const { user } = await createUserWithEmailAndPassword(auth, email, password);
		const userRef = doc(db, `/users/${user.email}`);
		await setDoc(userRef, { uid: user.uid, email: user.email });
	} catch (e) {
		console.log(e);
	}
};

export const logoutUser = async () => {
	await signOut(auth);
};

export const sendMessage = async (message, fileURL, uid, chatId) => {
	if ((!message && !fileURL) || !chatId || !uid) return;
	try {
		const chatRef = collection(db, `/chats/${chatId}/messages`);
		await addDoc(chatRef, { content: message, uid, fileURL: fileURL || [], sent: Date.now() });
	} catch (e) {
		console.log(e);
	}
};

export const findUser = async (otherEmail) => {
	if (!otherEmail) return;
	const userRef = doc(db, `/users/${otherEmail}`);
	const result = await getDoc(userRef);
	return result.data();
};

export const checkChatExists = async (currentEmail, otherEmail) => {
	const chatRef = collection(db, `/chats`);
	const q = query(chatRef, where('membersId', 'in', [[currentEmail, otherEmail]]));
	const results = await getDocs(q);
	return results.size;
};

export const createNewChat = async (current, otherEmail) => {
	const other = await findUser(otherEmail);
	if (!current || !other) return;
	try {
		const { uid, email } = current;
		const chatRef = collection(db, `/chats`);
		await addDoc(chatRef, {
			membersId: [current.email, other.email],
			members: [{ uid, email }, other],
		});
	} catch (e) {
		console.log(e);
	}
};

export const uploadFiles = async (chatId, file) => {
	if (!chatId || !file) return;
	const fileRef = ref(storage, `/chats/${chatId}/${file.uuid}`);
	const snapshot = uploadBytes(fileRef, file.file);
	return snapshot;
};

export const searchUser = async (email) => {
	if (!email) return;
	const userRef = collection(db, '/users');
	const result = await getDocs(userRef);
	if (result.empty) return;
	const docs = await Promise.all(result.docs.map((doc) => doc.data()));
	return docs.filter((doc) => doc.email.includes(email));
};
