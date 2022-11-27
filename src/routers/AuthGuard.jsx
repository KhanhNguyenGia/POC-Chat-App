import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';

const AuthGuard = ({ auth, unAuth }) => {
	const { user } = useContext(AuthContext);
	if (!user) {
		return unAuth;
	}
	return auth;
};

export default AuthGuard;
