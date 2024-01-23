import React, { useState } from 'react';
import { IoCheckmarkSharp } from 'react-icons/io5';
import { FiRotateCw } from 'react-icons/fi';
import { RiOpenSourceLine } from 'react-icons/ri';
import { httpRequest } from '../../../utils/axios-utils';
import { useAuthContext } from '../../../utils/auth/AuthProvider';
import { useDashboardContext } from '../../../providers/DashboardProvider';
import { toast } from 'react-toastify';
import { SUCCESS_TOAST_CONFIG } from '../../../constants/constants';
import { IoChevronBackSharp } from 'react-icons/io5';
import {
  Conversation,
  DashBoardState,
} from '../../../shared/models/shared.model';

const ChatScreenHeader = (props: any) => {
  const { conversationDetail, messages, setMessages } = props;
  const authContext = useAuthContext();
  const accountId = authContext?.getUserDetails().account_id;
  const DashboardContext = useDashboardContext();
  const { dashBoardState, conversationList, getIcons, updateDashboardState } =
    DashboardContext;
  const { selectedConversationId } = dashBoardState;
  const [isLoading, setIsLoading] = useState(false);

  const toggleStatus = (status: string | null = null): void => {
    setIsLoading(true);
    httpRequest({
      url: `api/v1/accounts/${accountId}/conversations/${selectedConversationId}/toggle_status`,
      method: 'post',
      params: { status },
    })
      .then(() => {
        toast.success('Status changed successfully', SUCCESS_TOAST_CONFIG);
      })
      .catch(() => {
        toast.error('Something went wrong!');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getChannelIcon = () => {
    const conversation = conversationList.find(
      (conversation: Conversation) => conversation.id === selectedConversationId
    );
    return getIcons(conversation?.meta.channel.slice(9));
  };

  const goBack = () => {
    updateDashboardState((prevState: DashBoardState) => {
      return { ...prevState, selectedConversationId: null };
    });
    setMessages(null);
  };

  return (
    <>
      <div className='flex items-center bg-[#151718] p-2 position-sticky top-0 z-10'>
        <IoChevronBackSharp
          onClick={goBack}
          className='cursor-pointer mr-3 lg:hidden'
        />
        <div className='h-10 w-10 rounded-full bg-[#135899] flex flex-row items-center justify-center mr-3'>
          <h6 className='m-0'>
            {messages.meta.contact.name
              .split(' ')
              .map((word: string) => {
                if (word) {
                  return word[0].toUpperCase();
                }
                return '';
              })
              .join('')
              .slice(0, 2)}
          </h6>
        </div>
        <div>
          <h6 className='mb-2'>{messages.meta.contact.name}</h6>
          <div className='flex items-center'>
            {getChannelIcon()}
            <small className='ml-1 text-xs text-[#787f85] font-semibold'>
              {conversationDetail.inbox_name}
            </small>
          </div>
        </div>
        <div
          className={`btn-group ml-auto ${
            conversationDetail?.conversation_status === 'resolved'
              ? 'bg-[#FFC532] hover:bg-[#f4af00]'
              : conversationDetail?.conversation_status === 'open'
              ? 'bg-[#44CE4B] hover:bg-[#2eae34]'
              : 'bg-[#1F93FF] hover:bg-[#0076e5]'
          }`}
          role='group'
        >
          <button
            className={`btn text-white ${isLoading && 'disabled'}`}
            onClick={() => {
              toggleStatus();
            }}
          >
            <div className='flex items-center'>
              <span className='pr-1'>
                {conversationDetail?.conversation_status === 'resolved' ? (
                  <FiRotateCw />
                ) : conversationDetail?.conversation_status === 'open' ? (
                  <IoCheckmarkSharp />
                ) : (
                  <RiOpenSourceLine />
                )}
              </span>
              {conversationDetail?.conversation_status === 'resolved'
                ? 'Reopen'
                : conversationDetail?.conversation_status === 'open'
                ? 'Resolve'
                : 'Open'}
            </div>
          </button>
          {conversationDetail?.conversation_status !== 'pending' && (
            <div className='btn-group' role='group'>
              <button
                type='button'
                className={`btn dropdown-toggle text-white ${
                  isLoading && 'disabled'
                }`}
                data-bs-toggle='dropdown'
                aria-expanded='false'
              ></button>
              <ul className='dropdown-menu'>
                <li>
                  <button
                    type='button'
                    className='dropdown-item btn !rounded-md hover:!bg-gray-300'
                    onClick={() => {
                      toggleStatus('pending');
                    }}
                  >
                    Mark as pending
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(ChatScreenHeader);
