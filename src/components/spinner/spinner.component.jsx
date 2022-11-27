const Spinner = ({ size = 'w-10 h-10' }) => {
	return (
		<div className={`animate-spin m-auto relative z-50 ${size}`}>
			<div className='absolute top-0 left-0 bg-gradient-to-r border-t-primary border-4 rounded-full w-full h-full m-auto'></div>
		</div>
	);
};

export default Spinner;
