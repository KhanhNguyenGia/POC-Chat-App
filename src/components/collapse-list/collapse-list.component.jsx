import { useState, Fragment } from 'react';
import { DownChevronIcon } from '../../assets/icon';

const CollapseList = ({ list, className, ...rest }) => {
	const [open, setOpen] = useState(-1);

	return (
		<ul className={`${className}`} {...rest} onClick={(e) => e.stopPropagation()}>
			{list.map((item, index) => (
				<Fragment key={index}>
					<li className='flex flex-col gap-3 transition-all'>
						<div
							className='flex flex-row justify-between gap-3 p-3 hover:bg-action'
							onClick={() => setOpen(() => (index === open ? -1 : index))}
						>
							{item.title}
							{item.chevron && (
								<DownChevronIcon
									className={`${
										open === index ? 'rotate-180' : 'rotate-0'
									} duration-300 transition-all`}
								/>
							)}
						</div>
						<div
							className={`${open === index ? 'h-max visible' : 'h-0 invisible overflow-hidden'}`}
						>
							{item.content()}
						</div>
					</li>
				</Fragment>
			))}
		</ul>
	);
};

export default CollapseList;
