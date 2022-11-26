const Switch = ({ htmlFor, ...rest }) => (
	<label className='block w-max h-7' htmlFor={htmlFor}>
		<input
			className='relative w-14 h-7 before:bg-slate-500 checked:before:bg-primary before:absolute before:w-full before:h-full before:rounded-full after:top-1 after:absolute after:w-[calc(50%_-_8px)] after:h-[calc(100%_-_8px)] after:bg-white after:rounded-full after:left-1 checked:after:left-[calc(50%_+_3px)] after:transition-all'
			type='checkbox'
			{...rest}
		/>
	</label>
);
export default Switch;
