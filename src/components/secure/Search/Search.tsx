import { ChangeEvent, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDashboardContext } from '../../../providers/DashboardProvider';
import { httpRequest } from '../../../utils/axios-utils';
import { useAuthContext } from '../../../utils/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import {
  SearchMessageResult,
  SearchMessage,
} from '../../../shared/models/shared.model';

const Search = () => {
  const dashboardContext = useDashboardContext();
  const authContext = useAuthContext();
  const { debounce, getIcons, formatTimePeriod } = dashboardContext;
  const [messageSearchResults, setMessageSearchResults] =
    useState<SearchMessageResult | null>(null);
  const [conversationSearchResults, setConversationSearchResults] =
    useState(null);
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
      {messageSearchResults &&
        messageSearchResults.payload.messages.length > 0 && (
          <div className='mt-2 overflow-y-scroll w-50 mx-auto'>
            <h5>Messages</h5>
            <ul className='p-0 mt-1'>
              {messageSearchResults.payload.messages.map(
                (message: SearchMessage) => {
                  return (
                    <li
                      key={message.id}
                      className='hover:bg-[#26292b] rounded-md cursor-pointer p-2'
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
          </div>
        )}
    </div>
  );
};

export default Search;
