const Overlay = ({ children, zIndex, ...rest }) => {
	return (
		<div
			className='absolute top-1/2 left-1/2 w-screen h-screen -translate-x-1/2 -translate-y-1/2 bg-[#0009] flex justify-center items-center z-10'
			{...rest}
		>
			{children}
		</div>
	);
};

export default Overlay;
