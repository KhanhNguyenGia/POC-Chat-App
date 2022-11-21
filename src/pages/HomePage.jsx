import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
	useEffect(() => {
		document.title = 'HomePage | MyChat';
	}, []);

	return (
		<div className='text-text font-bold text-4xl'>
			<h1>Homepage</h1>
			<Link to={'/chat'}>
				<button>Chat</button>
			</Link>
		</div>
	);
};

export default HomePage;
