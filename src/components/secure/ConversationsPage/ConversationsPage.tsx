import ChatScreen from '../ChatScreen/ChatScreen';
import ConversationsList from '../ConversationsList/ConversationsList';
import InboxList from '../InboxList/InboxList';
import './ConversationsPage.scss';

const ConversationsPage = () => {
  return (
    <div className='d-flex h-100 bg-neutral-300'>
      <div className='border-r border-gray-500 w-1/6 p-3'>
        <InboxList />
      </div>
      <div className='w-3/12 p-3 border-r border-gray-500'>
        <ConversationsList />
      </div>
      <div className='w-3/5 border-r border-gray-500 p-3'>
        <ChatScreen />
      </div>
    </div>
  );
};

export default ConversationsPage;
