import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../button/button.component';
import Switch from '../switch/switch.component';
import { Label } from './basic-info-tab.component';

const Tip = ({ children, ...rest }) => (
	<div
		className='py-3 px-5 text-gray-500 border-2 border-gray-500 border-opacity-20 rounded-lg'
		{...rest}
	>
		{children}
	</div>
);

const SETTING_DEFAULT = JSON.parse(localStorage.getItem('settings')) || {
	Notification: {
		value: true,
		subSet: {
			Phone: {
				value: true,
			},
			Email: {
				value: false,
			},
		},
	},
	ShareInfo: {
		value: false,
	},
};

const SETTING_TIPS = {
	Notification: 'Turning this off will stop all notifications.',
	Phone: 'You will receive push notification on your phone about new chat messages.',
	Email: 'You will receive email notification about new chat messages.',
	ShareInfo: 'Your info will be shared with developers for analysis.',
};

const SettingTab = () => {
	const [settings, setSettings] = useState(SETTING_DEFAULT);

	const onSubmit = (e) => {
		try {
			e.preventDefault();
			// console.log(settings);
			localStorage.setItem('settings', JSON.stringify(settings));
			location.reload();
		} catch (error) {
			toast.error('Failed to save settings');
		}
	};

	const onTopSetChange = (e) => {
		const { name, checked } = e.target;
		setSettings((prev) => ({
			...prev,
			[name]: {
				...prev[name],
				value: checked,
			},
		}));
	};

	const onSubSetChange = (e, topSet) => {
		const { name, checked } = e.target;
		setSettings((prev) => ({
			...prev,
			[topSet]: {
				...prev[topSet],
				subSet: {
					...prev[topSet].subSet,
					[name]: {
						...prev[topSet].subSet[name],
						value: checked,
					},
				},
			},
		}));
	};

	const onCancel = () => {
		setSettings(SETTING_DEFAULT);
	};

	return (
		<div className='flex-[4]'>
			<form className='flex flex-col gap-5' onSubmit={onSubmit}>
				{Object.keys(settings).map((setting, index) => {
					const { value, subSet: set } = settings[setting];
					const subSet = set || {};
					const temp = Object.keys(subSet);
					return (
						<div key={setting} className='flex flex-col gap-3'>
							<Label>{setting}</Label>
							<Switch
								htmlFor={setting}
								name={setting}
								id={setting}
								checked={value}
								onChange={onTopSetChange}
							/>
							{SETTING_TIPS[setting] && <Tip>{SETTING_TIPS[setting]}</Tip>}
							{value && !!temp.length && (
								<div className='flex flex-col pl-5 gap-5'>
									{temp.map((set) => {
										const { value } = subSet[set];
										return (
											<div key={set} className='flex flex-col gap-3'>
												<Label>{set}</Label>
												<Switch
													htmlFor={set}
													name={set}
													id={set}
													checked={value}
													onChange={(e) => onSubSetChange(e, setting)}
												/>
												<Tip>{SETTING_TIPS[set]}</Tip>
											</div>
										);
									})}
								</div>
							)}
						</div>
					);
				})}
				{JSON.stringify(settings) !== JSON.stringify(SETTING_DEFAULT) && (
					<div className='flex flex-row gap-3'>
						<Button type='submit'>Save</Button>
						<Button type='button' color='secondary' onClick={onCancel}>
							Cancel
						</Button>
					</div>
				)}
			</form>
		</div>
	);
};

export default SettingTab;
