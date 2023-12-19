import { useState, useEffect } from 'react';
import { useAuthContext } from '../../../utils/auth/AuthProvider';
import { httpRequest } from '../../../utils/axios-utils';
import { useDashboardContext } from '../../../providers/DashboardProvider';
import { DashBoardState } from '../../../shared/models/shared.model';

const ConversationsList = () => {
  const [conversationList, setConversationList] = useState<any>(null);
  const dashboardContext = useDashboardContext();
  const authContext = useAuthContext();
  const { dashBoardState, updateDashboardState } = dashboardContext;

  useEffect(() => {
    httpRequest({
      url: `api/v1/accounts/${
        authContext?.getUserDetails().account_id
      }/conversations`,
      method: 'get',
      params: {
        inbox_id: dashboardContext.dashBoardState.selectedInboxId,
      },
    })
      .then((response) => {
        setConversationList(response.data.data.payload);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [
    dashBoardState.selectedInboxId,
    dashBoardState.postedMessageId,
    dashBoardState.messageSeenId,
    dashBoardState.receivedMessage,
  ]);

  return (
    <>
      {conversationList && (
        <div>
          <h4 className='mb-3'>Conversations</h4>
          <ul className='p-0 m-0'>
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
                  <div className='flex flex-row items-center'>
                    <div className='h-10 w-10 rounded-full bg-[#135899] flex flex-row items-center justify-center mr-3'>
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
