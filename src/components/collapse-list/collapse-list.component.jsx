import { useState, Fragment } from 'react';
import { DownChevronIcon } from '../../assets/icon';

const CollapseList = ({ list, className, ...rest }) => {
	const [open, setOpen] = useState(-1);

	return (
		<ul className={`${className} duration-300 transition-all`} {...rest}>
			{list.map((item, index) => (
				<Fragment key={index}>
					<li
						className={`${item.childClass} ${index === open ? 'bg-action' : ''}`}
						onClick={() => setOpen(() => (index === open ? -1 : index))}
					>
						{item.title}
						{item.chevron && (
							<DownChevronIcon
								className={`${open === index ? 'rotate-180' : 'rotate-0'} transition-all`}
							/>
						)}
					</li>
					{item.content && (
						<div
							className={`duration-300 transition-all p-5 ${
								open === index ? 'h-max visible opacity-100' : 'h-0 invisible opacity-0'
							}`}
						>
							{item.content ||
								`
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio minima libero natus
						ipsum alias officia ab incidunt ad nulla debitis, eligendi aperiam eius voluptate enim
						autem molestiae id unde assumenda!`}
						</div>
					)}
				</Fragment>
			))}
		</ul>
	);
};

export default CollapseList;
