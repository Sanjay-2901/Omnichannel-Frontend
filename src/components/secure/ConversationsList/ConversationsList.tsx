import { useEffect } from 'react';
import { useAuthContext } from '../../../utils/auth/AuthProvider';
import { httpRequest } from '../../../utils/axios-utils';
import { useDashboardContext } from '../../../providers/DashboardProvider';
import { DashBoardState } from '../../../shared/models/shared.model';
import { HiBars3CenterLeft } from 'react-icons/hi2';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ConversationsList = () => {
  const dashboardContext = useDashboardContext();
  const authContext = useAuthContext();
  const {
    dashBoardState,
    updateDashboardState,
    getIcons,
    conversationList,
    setConversationList,
    getInboxName,
  } = dashboardContext;
  const navigate = useNavigate();

  useEffect(() => {
    httpRequest({
      url: `api/v1/accounts/${
        authContext?.getUserDetails().account_id
      }/conversations`,
      method: 'get',
      params: {
        inbox_id: dashboardContext.dashBoardState.selectedInboxId,
        status: 'all',
      },
    })
      .then((response) => {
        setConversationList(response.data.data.payload);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [
    dashBoardState.selectedInboxId,
    dashBoardState.postedMessageId,
    dashBoardState.messageSeenId,
    dashBoardState.receivedMessage,
  ]);

  const toggleInboxes = () => {
    updateDashboardState((prevState: DashBoardState) => {
      return { ...prevState, showInboxes: !prevState.showInboxes };
    });
  };

  const navigateToSearchPage = () => {
    navigate('/search');
  };

  return (
    <>
      {conversationList && (
        <div className='relative h-full flex flex-col'>
          <div className='flex items-center mb-3 sticky'>
            <HiBars3CenterLeft
              size={20}
              onClick={toggleInboxes}
              className='cursor-pointer lg:hidden'
            />
            <h4 className='ml-3 mb-0'>Conversations</h4>
            <div
              className='ml-5 bg-[#4c5155] h-8 w-8 rounded-md flex items-center justify-center cursor-pointer'
              onClick={navigateToSearchPage}
            >
              <FaSearch />
            </div>
          </div>
          <ul className='p-0 m-0 overflow-y-scroll h-full'>
            {conversationList.length > 0 ? (
              conversationList.map((conversation: any) => (
                <li
                  key={conversation.id}
                  className={`${
                    dashBoardState.selectedConversationId === conversation.id &&
                    'bg-[#26292B]'
                  } mb-2 cursor-pointer hover:bg-[#26292B] p-2 rounded-md flex flex-row justify-between border-b-2 border-b-[#26292B]`}
                  onClick={() => {
                    updateDashboardState((prevState: DashBoardState) => {
                      return {
                        ...prevState,
                        selectedConversationId: conversation.id,
                      };
                    });
                  }}
                >
                  <div className='flex flex-row'>
                    <div className='h-10 w-10 rounded-full bg-[#135899] flex flex-row items-center justify-center mr-3 self-end'>
                      <h6 className='m-0'>
                        {conversation.meta.sender.name
                          .split(' ')
                          .map((word: string) => {
                            if (word) {
                              return word[0].toUpperCase();
                            }
                          })
                          .join('')
                          .slice(0, 2)}
                      </h6>
                    </div>
                    <div>
                      <div className='flex items-center mb-2'>
                        {getIcons(conversation.meta.channel.slice(9))}
                        <small className='text-[#787f85] text-xs font-semibold ml-1'>
                          {getInboxName(conversation.id).inbox_name}
                        </small>
                      </div>
                      <h6 className='mb-1'>{conversation.meta.sender.name}</h6>
                      <p className='m-0'>{conversation.messages[0].content}</p>
                    </div>
                  </div>
                  {+conversation.messages[0].conversation.unread_count > 0 && (
                    <div className='rounded-full bg-green-400 h-5 w-5 place-self-end flex flex-row items-center justify-center'>
                      <small className='text-xs text-black font-semibold'>
                        {+conversation.messages[0].conversation.unread_count < 9
                          ? conversation.messages[0].conversation.unread_count
                          : '9+'}
                      </small>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <h6 className='mt-5 text-center'>No conversations found</h6>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default ConversationsList;
