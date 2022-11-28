const Overlay = ({ children, zIndex, ...rest }) => {
	return (
		<div
			className='w-screen h-screen fixed top-0 left-0 bg-[#0009] z-50 overflow-hidden flex justify-center items-center'
			{...rest}
		>
			{children}
		</div>
	);
};

export default Overlay;
