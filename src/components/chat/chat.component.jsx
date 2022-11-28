import { Outlet, useParams } from 'react-router';
import { ChatList } from '.';

const Chat = () => {
	const { chatId } = useParams();

	return (
		<>
			<main className='relative xs:static w-full max-h-full h-full overflow-hidden'>
				<div className='flex gap-5 h-full max-h-full'>
					<ChatList />
					<div
						className={`fixed top-0 z-20 sm:z-10 ${
							chatId ? '-right-0 flex' : '-right-full'
						} bg-bg xs:bg-layer flex-[4] xs:static xs:right-0 max-h-full h-full xs:flex flex-col m-auto rounded-lg gap-3 p-3 overflow-hidden w-full duration-[230ms] transition-all`}
					>
						<Outlet />
					</div>
				</div>
			</main>
		</>
	);
};

export default Chat;
