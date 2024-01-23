import React, { useState } from 'react';
import { IoCheckmarkSharp } from 'react-icons/io5';
import { FiRotateCw } from 'react-icons/fi';
import { RiOpenSourceLine } from 'react-icons/ri';
import { httpRequest } from '../../../utils/axios-utils';
import { useAuthContext } from '../../../utils/auth/AuthProvider';
import { useDashboardContext } from '../../../providers/DashboardProvider';
import { toast } from 'react-toastify';
import { SUCCESS_TOAST_CONFIG } from '../../../constants/constants';

const StatusButton = (props: any) => {
  const { conversationDetail } = props;
  const authContext = useAuthContext();
  const accountId = authContext?.getUserDetails().account_id;
  const DashboardContext = useDashboardContext();
  const { dashBoardState } = DashboardContext;
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

  return (
    <>
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
    </>
  );
};

export default React.memo(StatusButton);
