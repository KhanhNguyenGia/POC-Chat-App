import { createContext, useReducer } from 'react';

export const ChatContext = createContext();

export const CHAT_ACTION_TYPES = {
	UPDATE_COLOR: 'CHAT/UPDATE_COLOR',
};

export const DEFAULT_CHAT = {
	theme: '0092CA',
};

export const chatReducer = (state, action) => {
	const { type, payload } = action;
	switch (type) {
		case CHAT_ACTION_TYPES.UPDATE_COLOR:
			return { ...state, theme: payload };
		default:
			return state;
	}
};

export const ChatProvider = ({ children }) => {
	const [state, dispatch] = useReducer(chatReducer, DEFAULT_CHAT);

	return <ChatContext.Provider value={{ ...state, dispatch }}>{children}</ChatContext.Provider>;
};
