const Spinner = () => {
	return (
		<div className='animate-spin m-auto relative w-10 h-10'>
			<div className='absolute top-0 left-0 bg-gradient-to-r border-t-primary border-4 rounded-full w-full h-full m-auto'></div>
		</div>
	);
};

export default Spinner;
