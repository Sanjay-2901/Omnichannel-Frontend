import { useEffect, useState } from 'react';
import { useDashboardContext } from '../../../providers/DashboardProvider';
import { IoLogoSnapchat } from 'react-icons/io';
import { httpRequest } from '../../../utils/axios-utils';
import { useAuthContext } from '../../../utils/auth/AuthProvider';
import './ChatScreen.scss';

const ChatScreen = () => {
  const dashboardContext = useDashboardContext();
  const authContext = useAuthContext();
  const { dashBoardState, updateDashboardState } = dashboardContext;
  const [messages, setMessages] = useState<any>(null);

  useEffect(() => {
    if (dashBoardState.selectedConversationId) {
      httpRequest({
        url: `api/v1/accounts/${
          authContext?.getUserDetails().account_id
        }/conversations/${dashBoardState.selectedConversationId}/messages`,
      })
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [dashBoardState]);

  return (
    <>
      {!dashBoardState.selectedConversationId && (
        <div className='flex items-center justify-center h-100'>
          <div className='flex flex-column items-center'>
            <IoLogoSnapchat size={70} />
            <h4>Please select a conversation</h4>
          </div>
        </div>
      )}
      <div>
        {messages && (
          <div className='flex flex-row items-center bg-[#000000] p-2 position-sticky top-0'>
            <div className='h-10 w-10 rounded-full bg-[#135899] flex flex-row items-center justify-center mr-3'>
              <h6 className='m-0'>
                {messages.meta.contact.name[0].toUpperCase()}
              </h6>
            </div>
            <div>
              <h6 className='mb-1'>{messages.meta.contact.name}</h6>
            </div>
          </div>
        )}
        {messages && (
          <div className='flex flex-col justify-en p-3 bg-re-500 min-h-screen'>
            {messages.payload.map((message: any, index: number) => (
              <div
                key={index}
                className={`mb-2 ${
                  message.message_type === 0
                    ? 'bg-gray-300 self-start text-dark rounded-r-lg'
                    : 'bg-blue-500 self-end rounded-l-lg'
                } p-2 rounded-t-md`}
              >
                {message.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ChatScreen;
