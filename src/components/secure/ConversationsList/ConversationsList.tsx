import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../utils/auth/AuthProvider';
import { httpRequest } from '../../../utils/axios-utils';
import { useDashboardContext } from '../../../providers/DashboardProvider';
import {
  Conversation,
  DashBoardState,
} from '../../../shared/models/shared.model';
import { HiBars3CenterLeft } from 'react-icons/hi2';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { LuInfo } from 'react-icons/lu';

const ConversationsList = () => {
  const dashboardContext = useDashboardContext();
  const authContext = useAuthContext();
  const {
    dashBoardState,
    updateDashboardState,
    getIcons,
    conversationList,
    setConversationList,
    getConversationDetails,
  } = dashboardContext;
  const navigate = useNavigate();
  const assigneeTypeButtons = ['Mine', 'Unassigned', 'All'];
  const [isConversationsLoading, setIsConversationsLoading] = useState(false);

  useEffect(() => {
    setIsConversationsLoading(true);
    httpRequest({
      url: `api/v1/accounts/${
        authContext?.getUserDetails().account_id
      }/conversations`,
      method: 'get',
      params: {
        inbox_id: dashboardContext.dashBoardState.selectedInboxId,
        assignee_type:
          dashBoardState.assigneeType === 'Mine'
            ? 'me'
            : dashBoardState.assigneeType.toLowerCase(),
        status: 'all',
      },
    })
      .then((response) => {
        setConversationList(response.data.data.payload);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsConversationsLoading(false);
      });
  }, [
    dashBoardState.selectedInboxId,
    dashBoardState.assigneeType,
    dashBoardState.newConversationId,
  ]);

  useEffect(() => {
    if (
      dashBoardState.receivedMessage?.conversation_id !==
      dashBoardState.selectedConversationId
    ) {
      const latestMessage = dashBoardState.receivedMessage;
      setConversationList((prevState: Conversation[]) => {
        const newList = [...prevState];
        const index = prevState.findIndex((conversation: Conversation) => {
          return conversation.id === latestMessage?.conversation_id;
        });
        if (index !== -1) {
          const conversationToBeUpdated = prevState[index];
          conversationToBeUpdated.last_non_activity_message.content =
            latestMessage.content;
          conversationToBeUpdated.last_non_activity_message.conversation.unread_count =
            latestMessage.conversation.unread_count;
          newList.splice(index, 1);
          newList.unshift(conversationToBeUpdated);
          return newList;
        }
        return prevState;
      });
    }
  }, [dashBoardState.receivedMessage]);

  const toggleInboxes = (): void => {
    updateDashboardState((prevState: DashBoardState) => {
      return { ...prevState, showInboxes: !prevState.showInboxes };
    });
  };

  const navigateToSearchPage = (): void => {
    navigate('/search');
  };

  const changeAssigneeType = (assigneeType: string): void => {
    updateDashboardState((prevState: DashBoardState) => {
      return {
        ...prevState,
        assigneeType: assigneeType,
      };
    });
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
          <div className='mb-2 flex'>
            {assigneeTypeButtons.map((buttonName: string, index: number) => {
              return (
                <div
                  key={index}
                  className={`${
                    dashBoardState.assigneeType === buttonName &&
                    'text-[#369eff] border-b-2 border-[#369eff]'
                  } mr-4 pb-1`}
                >
                  <button
                    onClick={() => {
                      changeAssigneeType(buttonName);
                    }}
                  >
                    {buttonName}
                  </button>
                </div>
              );
            })}
          </div>
          {isConversationsLoading && (
            <div className='center-el z-30'>
              <div className='spinner-border spinner-border-md'></div>
            </div>
          )}
          <ul className='p-0 m-0 overflow-y-scroll h-full'>
            {conversationList.length > 0
              ? conversationList.map((conversation: Conversation) => (
                  <li
                    key={conversation.id}
                    className={`${
                      dashBoardState.selectedConversationId ===
                        conversation.id && 'bg-[#26292B]'
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
                            {
                              getConversationDetails(conversation.id)
                                ?.inbox_name
                            }
                          </small>
                        </div>
                        <h6 className='mb-1'>
                          {conversation.meta.sender.name}
                        </h6>
                        <p className='m-0'>
                          {conversation?.last_non_activity_message?.content &&
                            (conversation.last_non_activity_message.content
                              .length < 45
                              ? conversation.last_non_activity_message.content
                              : `${conversation.last_non_activity_message.content.slice(
                                  0,
                                  45
                                )}...`)}
                        </p>
                      </div>
                    </div>
                    {+conversation.last_non_activity_message.conversation
                      .unread_count > 0 && (
                      <div className='rounded-full bg-green-400 h-5 w-5 place-self-end flex flex-row items-center justify-center'>
                        <small className='text-xs text-black font-semibold'>
                          {+conversation.last_non_activity_message.conversation
                            .unread_count < 9
                            ? conversation.last_non_activity_message
                                .conversation.unread_count
                            : '9+'}
                        </small>
                      </div>
                    )}
                  </li>
                ))
              : !isConversationsLoading && (
                  <div>
                    <LuInfo className='mx-auto mt-5' size={30} />
                    <h6 className='mt-3 text-center'>No conversations found</h6>
                  </div>
                )}
          </ul>
        </div>
      )}
    </>
  );
};

export default React.memo(ConversationsList);
