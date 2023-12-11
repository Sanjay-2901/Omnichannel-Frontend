import DashboardProvider from '../../../providers/DashboardProvider';
import ChatScreen from '../ChatScreen/ChatScreen';
import ConversationsList from '../ConversationsList/ConversationsList';
import InboxList from '../InboxList/InboxList';
import './Dashboard.scss';

const Dashboard = () => {
  return (
    <DashboardProvider>
      <div className='bg-neutral-300 flex h-full'>
        <div className='w-1/6 p-2 bg pt-3'>
          <InboxList />
        </div>
        <div className='w-3/12 p-2 bg pt-3'>
          <ConversationsList />
        </div>
        <div className='w-3/5 bg-chat'>
          <ChatScreen />
        </div>
      </div>
    </DashboardProvider>
  );
};

export default Dashboard;
