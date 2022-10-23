export const BUTTON_TYPES = {
	primary: 'primary',
	secondary: 'secondary',
	action: 'action',
};

const Button = ({
	color = 'primary',
	children = 'Button',
	type = 'button',
	className = '',
	...rest
}) => {
	return (
		<button
			className={`bg-${
				BUTTON_TYPES[color] || 'primary'
			} flex-1 px-5 py-2 rounded-md text-text text-md font-medium hover:bg-action transition-all ${className}`}
			type={type}
			{...rest}
		>
			{children}
		</button>
	);
};

export default Button;
