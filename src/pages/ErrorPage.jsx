import { Link } from 'react-router-dom';
import Button from '../components/button/button.component';

const ERROR_MESSAGE = {
	404: 'The content you are looking for is not available',
	500: 'Internal server error',
	403: 'Forbidden',
	401: 'Unauthorized',
	400: 'Bad request',
};

const ErrorPage = ({ code = 404 }) => {
	return (
		<div className='h-[calc(100vh_-_80px)] flex justify-center items-center flex-col gap-5 p-5 max-w-7xl text-center'>
			<h1 className='text-primary font-bold text-4xl'>
				Error <span className='text-primary'>{code}</span>
			</h1>
			<h2 className='text-gray-400 font-semibold text-2xl'>{ERROR_MESSAGE[code]}</h2>
			<Link to='/'>
				<Button className='flex-none'>Back to homepage</Button>
			</Link>
		</div>
	);
};

export default ErrorPage;
