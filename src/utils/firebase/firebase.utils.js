import { initializeApp } from 'firebase/app';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	limit,
	query,
	setDoc,
	updateDoc,
	where,
} from 'firebase/firestore';
import {
	getAuth,
	signInWithPopup,
	signOut,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	FacebookAuthProvider,
} from 'firebase/auth';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyBWdfeN1kOntlt7JIGjVaCgzCPNdP0mM1M',
	authDomain: 'poc-chat-app-6da8c.firebaseapp.com',
	projectId: 'poc-chat-app-6da8c',
	storageBucket: 'poc-chat-app-6da8c.appspot.com',
	messagingSenderId: '228297410990',
	appId: '1:228297410990:web:0f57004f2ad82e9acee03f',
};

export const AUTH_ERROR_TYPE = {
	PASSWORD_DO_NOT_MATCH: 'Password do not match',
	USER_NOT_FOUND: 'auth/user-not-found',
	WRONG_PASSWORD: 'auth/wrong-password',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export const setUser = async (user) => {
	const userRef = doc(db, `/users/${user.uid}`);
	const { uid, email, photoURL, displayName } = user;
	const userDoc = await getDoc(userRef);
	if (userDoc.exists()) return;
	await setDoc(userRef, { uid, email, photoURL, displayName });
};

export const googlePopup = async () => {
	const { user } = await signInWithPopup(auth, googleProvider);
	const userRef = doc(db, `/users/${user.uid}`);
	const { uid, email, photoURL, displayName } = user;
	const userDoc = await getDoc(userRef);
	if (userDoc.exists()) return;
	await setDoc(userRef, { uid, email, photoURL, displayName });
};

export const signInWithEmail = async (email, password) => {
	if (!email || !password) return;
	const { user } = await signInWithEmailAndPassword(auth, email, password);
	const userRef = doc(db, `/users/${user.uid}`);
	const userDoc = await getDoc(userRef);
	if (userDoc.exists()) return;
	await setDoc(userRef, {
		uid: user.uid,
		email: user.email,
		photoURL: user.photoURL,
		displayName: user.displayName,
	});
	return user;
};

export const signUp = async (email, password) => {
	if (!email || !password) return;
	const { user } = await createUserWithEmailAndPassword(auth, email, password);
	const userRef = doc(db, `/users/${user.uid}`);
	await setDoc(userRef, {
		uid: user.uid,
		email: user.email,
		photoURL: user.photoURL,
		displayName: user.displayName,
	});
};

export const logoutUser = async () => {
	await signOut(auth);
};

export const sendMessage = async (message, fileURL, uid, chatId) => {
	if ((!message && !fileURL) || !chatId || !uid) return;
	try {
		const chatDocRef = doc(db, `/chats/${chatId}`);
		await updateDoc(chatDocRef, {
			updated: Date.now(),
		});
		const chatRef = collection(db, `/chats/${chatId}/messages`);
		await addDoc(chatRef, { content: message, uid, fileURL: fileURL || [], sent: Date.now() });
	} catch (e) {
		console.log(e);
	}
};

export const checkChatExists = async (members) => {
	const chatRef = collection(db, `/chats`);
	const q = query(
		chatRef,
		where('membersId', 'in', [[...members.map((member) => member.uid)].sort()])
	);
	const results = await getDocs(q);
	return results.size;
};

export const createNewChat = async (current, other) => {
	if (!current || !other) return;
	const { uid, email, photoURL, displayName } = current;
	try {
		const chatRef = collection(db, `/chats`);
		await addDoc(chatRef, {
			membersId: [current.uid, other.uid].sort(),
			members: [{ uid, email, photoURL, displayName }, other].sort((a, b) =>
				a.uid.localeCompare(b.uid)
			),
			updated: Date.now(),
		});
	} catch (e) {
		console.log(e);
	}
};

export const createGroupChat = async (members) => {
	if (!members || !members.length) return;
	try {
		const chatRef = collection(db, `/chats`);
		await addDoc(chatRef, {
			membersId: members.map((member) => member.uid).sort(),
			members: members.sort((a, b) => a.uid.localeCompare(b.uid)),
			updated: Date.now(),
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

export const searchUser = async (search, currentEmail) => {
	if (!search) return;
	const userRef = collection(db, '/users');
	const q = query(userRef, limit(10));
	const result = await getDocs(q);
	if (result.empty) return;
	const docs = await Promise.all(result.docs.map((doc) => doc.data()));
	return docs.filter((doc) => doc.email.includes(search) && doc.email !== currentEmail);
};

export const getChatMembers = async (chatId) => {
	const docRef = doc(db, `/chats/${chatId}`);
	const result = await getDoc(docRef);
	if (!result.exists()) return;
	return await result.data().members;
};

export const checkChatValid = async (chat, uid) => {
	if (!chat) return false;
	const docRef = doc(db, 'chats', chat);
	const docSnap = await getDoc(docRef);
	if (!docSnap.exists()) return false;
	const members = await docSnap.data().membersId;
	return members.includes(uid);
};
