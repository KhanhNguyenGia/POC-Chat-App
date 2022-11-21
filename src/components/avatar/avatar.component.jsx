const Avatar = ({ avaSize = 50, members, ...rest }) => {
	switch (members.length) {
		case 1:
			return (
				<div
					className={`flex flex-row rounded-lg overflow-hidden`}
					style={{
						width: avaSize,
						height: avaSize,
						minWidth: avaSize,
						minHeight: avaSize,
					}}
					{...rest}
				>
					{members.map((member) =>
						member?.photoURL ? (
							<img
								key={member?.email}
								src={member?.photoURL}
								alt={member?.email}
								className={`object-center object-cover`}
								style={{
									width: avaSize / 1,
									height: avaSize / 1,
								}}
							/>
						) : (
							<div
								key={member?.email}
								className={`text-text font-medium text-4xl flex justify-center items-center bg-slate-500`}
								style={{
									width: avaSize / 1,
									height: avaSize / 1,
								}}
							>
								{member?.email.charAt(0).toUpperCase()}
							</div>
						)
					)}
				</div>
			);
		case 2:
			return (
				<div
					className={`flex flex-row rounded-lg overflow-hidden flex-wrap`}
					style={{
						width: avaSize,
						height: avaSize,
						minWidth: avaSize,
						minHeight: avaSize,
					}}
					{...rest}
				>
					{members.map((member) =>
						member?.photoURL ? (
							<img
								key={member?.email}
								src={member?.photoURL}
								alt={member?.email}
								className={`object-center object-cover`}
								style={{
									width: avaSize / 2,
									height: avaSize / 1,
								}}
							/>
						) : (
							<div
								key={member?.email}
								className={`text-text font-medium text-2xl flex justify-center items-center bg-slate-500`}
								style={{
									width: avaSize / 2,
									height: avaSize / 1,
								}}
							>
								{member?.email.charAt(0).toUpperCase()}
							</div>
						)
					)}
				</div>
			);
		case 3:
			return (
				<div
					className={`flex flex-row rounded-lg overflow-hidden flex-wrap`}
					style={{
						width: avaSize,
						height: avaSize,
						minWidth: avaSize,
						minHeight: avaSize,
					}}
					{...rest}
				>
					{members.map((member, index) =>
						member?.photoURL ? (
							<img
								key={member?.email}
								src={member?.photoURL}
								alt={member?.email}
								className={`object-center object-cover`}
								style={{
									width: index === 2 ? avaSize / 1 : avaSize / 2,
									height: avaSize / 2,
								}}
							/>
						) : (
							<div
								key={member?.email}
								className={`text-text font-medium text-xl flex justify-center items-center bg-slate-500`}
								style={{
									width: index === 2 ? avaSize / 1 : avaSize / 2,
									height: avaSize / 2,
								}}
							>
								{member?.email.charAt(0).toUpperCase()}
							</div>
						)
					)}
				</div>
			);
		default:
			return (
				<div
					className={`flex flex-row rounded-lg overflow-hidden flex-wrap`}
					style={{
						width: avaSize,
						height: avaSize,
						minWidth: avaSize,
						minHeight: avaSize,
					}}
					{...rest}
				>
					{members.map((member) =>
						member?.photoURL ? (
							<img
								key={member?.email}
								src={member?.photoURL}
								alt={member?.email}
								className={`object-center object-cover`}
								style={{
									width: avaSize / 2,
									height: avaSize / 2,
								}}
							/>
						) : (
							<div
								key={member?.email}
								className={`text-text font-medium text-xl flex justify-center items-center bg-slate-500`}
								style={{
									width: avaSize / 2,
									height: avaSize / 2,
								}}
							>
								{member?.email.charAt(0).toUpperCase()}
							</div>
						)
					)}
				</div>
			);
	}
};

export default Avatar;
