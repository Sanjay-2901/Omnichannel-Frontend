import { ChangeEvent, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDashboardContext } from '../../../providers/DashboardProvider';
import { httpRequest } from '../../../utils/axios-utils';
import { useAuthContext } from '../../../utils/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import {
  SearchMessageResult,
  SearchMessage,
  SearchConversationResult,
  ConversationResult,
  DashBoardState,
} from '../../../shared/models/shared.model';
import { IoIosInformationCircleOutline } from 'react-icons/io';

const Search = () => {
  const dashboardContext = useDashboardContext();
  const authContext = useAuthContext();
  const { debounce, getIcons, formatTimePeriod, updateDashboardState } =
    dashboardContext;
  const [messageSearchResults, setMessageSearchResults] =
    useState<SearchMessageResult | null>(null);
  const [conversationSearchResults, setConversationSearchResults] =
    useState<SearchConversationResult | null>(null);
  const navigate = useNavigate();

  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    if (searchValue && searchValue.length > 2) {
      httpRequest({
        url: `api/v1/accounts/${
          authContext?.getUserDetails().account_id
        }/search/messages`,
        params: { q: searchValue },
      })
        .then((response) => {
          setMessageSearchResults(response.data);
        })
        .catch((error) => {
          console.error(error);
        });

      httpRequest({
        url: `api/v1/accounts/${
          authContext?.getUserDetails().account_id
        }/search/conversations`,
        params: { q: searchValue },
      })
        .then((response) => {
          setConversationSearchResults(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setMessageSearchResults(null);
      setConversationSearchResults(null);
    }
  };

  const goBack = () => {
    navigate('/dashboard');
  };

  const debouncedSearch = debounce(onSearch, 500);

  const selectSearchResult = (result: any) => {
    if (result.hasOwnProperty('agent')) {
      updateDashboardState((prevState: DashBoardState) => {
        return { ...prevState, selectedConversationId: result.id };
      });
      navigate('/dashboard');
    } else {
      updateDashboardState((prevState: DashBoardState) => {
        return {
          ...prevState,
          searchedMessageId: result.id,
          selectedConversationId: result.conversation_id,
        };
      });
      navigate('/dashboard');
    }
  };

  return (
    <div className='bg-[#151718] h-full text-white flex flex-col'>
      <div>
        <button className='btn btn-secondary ml-4 mt-4 flex' onClick={goBack}>
          Back
        </button>
      </div>
      <div className='mx-auto w-50 pt-3'>
        <input
          type='search'
          id='search'
          placeholder='Type 3 or more characters to search'
          className='w-full p-2 bg-[#151718] border-1 focus:border-blue-500 outline-none'
          autoComplete='off'
          onChange={debouncedSearch}
        />
        {!conversationSearchResults && !messageSearchResults && (
          <div>
            <FaSearch className='mt-4 mx-auto' size={25} />
            <h6 className='font-light mt-4 text-center text-[#9ba1a6]'>
              Search by conversation name, messages for better search results.
            </h6>
          </div>
        )}
      </div>
      {messageSearchResults && conversationSearchResults && (
        <div className='mt-2 overflow-y-scroll w-50 mx-auto p-2'>
          <h5>Messages</h5>
          {messageSearchResults!.payload.messages.length > 0 ? (
            <ul className='p-0 mt-1'>
              {messageSearchResults.payload.messages.map(
                (message: SearchMessage) => {
                  return (
                    <li
                      key={message.id}
                      className='hover:bg-[#26292b] rounded-md cursor-pointer p-2'
                      onClick={() => {
                        selectSearchResult(message);
                      }}
                    >
                      <div className='flex justify-between'>
                        <div className='flex items-center bg-[#26292b] p-1 rounded-md'>
                          {getIcons(message.inbox.channel_type.slice(9))}
                          <small className='text-[#787f85] font-semibold ml-1'>
                            {message.inbox.name}
                          </small>
                        </div>
                        <small className='text-xs'>
                          {formatTimePeriod(+message.created_at)}
                        </small>
                      </div>
                      <div className='mt-2 border-l-2 pl-2'>
                        <p className='font-light m-0'>
                          <span className='font-semibold'>
                            {message.sender.name}
                          </span>{' '}
                          wrote:
                        </p>
                        <p className='m-0'>{message.content}</p>
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
          ) : (
            <div className='bg-[#26292b] p-3 rounded-md flex justify-center'>
              <div className='flex items-center'>
                <IoIosInformationCircleOutline size={20} />
                <h6 className='m-0 pl-2'>No messages found</h6>
              </div>
            </div>
          )}
          <h5 className='mt-3'>Conversations</h5>
          {conversationSearchResults!.payload.conversations.length > 0 ? (
            <ul className='p-0 mt-1'>
              {conversationSearchResults!.payload.conversations.map(
                (conversation: ConversationResult) => {
                  return (
                    <li
                      key={conversation.id}
                      className='hover:bg-[#26292b] rounded-md cursor-pointer p-2'
                      onClick={() => {
                        selectSearchResult(conversation);
                      }}
                    >
                      <div className='flex justify-between'>
                        <div className='flex items-center bg-[#26292b] p-1 rounded-md'>
                          {getIcons(conversation.inbox.channel_type.slice(9))}
                          <small className='text-[#787f85] font-semibold ml-1'>
                            {conversation.inbox.name}
                          </small>
                        </div>
                        <small className='text-xs'>
                          {formatTimePeriod(+conversation.created_at)}
                        </small>
                      </div>
                      <div className='mt-2 border-l-2 pl-2'>
                        <p className='font-light m-0'>
                          from:{' '}
                          <span className='font-semibold'>
                            {conversation.message.sender.name}
                          </span>
                        </p>
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
          ) : (
            <div className='bg-[#26292b] p-3 rounded-md flex justify-center mb-3'>
              <div className='flex items-center'>
                <IoIosInformationCircleOutline size={20} />
                <h6 className='m-0 pl-2'>No conversations found</h6>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
