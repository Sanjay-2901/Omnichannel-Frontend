import React, { useEffect, useState, useRef, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDashboardContext } from '../../../providers/DashboardProvider';
import { httpRequest } from '../../../utils/axios-utils';
import { useAuthContext } from '../../../utils/auth/AuthProvider';
import { IoLogoSnapchat } from 'react-icons/io';
import { IoSendSharp } from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import './ChatScreen.scss';
import {
  Conversation,
  DashBoardState,
} from '../../../shared/models/shared.model';
import { IoChevronBackSharp } from 'react-icons/io5';

type MessageForm = {
  message: string;
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<any | null>(null);
  const DashboardContext = useDashboardContext();
  const {
    dashBoardState,
    updateDashboardState,
    getInboxName,
    conversationList,
    getIcons,
  } = DashboardContext;
  const { selectedConversationId } = dashBoardState;
  const authContext = useAuthContext();
  const accountId = authContext?.getUserDetails().account_id;
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDataEmpty, setIsDataEmpty] = useState(false);
  const [isMessageSending, setIsMessageSending] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const methods = useForm<MessageForm>({
    defaultValues: {
      message: '',
    },
  });
  const { isValid } = methods.formState;

  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages();
      updateMessageSeen();
    }
  }, [selectedConversationId]);

  useEffect(() => {
    if (messages) {
      if (messages.payload.length <= 20) {
        scrollToBottom();
      }
    }
  }, [messages]);

  useEffect(() => {
    if (
      dashBoardState.receivedMessage?.conversation_id ===
        dashBoardState.selectedConversationId &&
      messages
    ) {
      updateMessageSeen();
      setMessages((prevData: any) => {
        return {
          ...prevData,
          payload: [dashBoardState.receivedMessage, ...prevData.payload],
        };
      });
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
      });
    }
  }, [dashBoardState.receivedMessage]);

  const scrollToBottom = () => {
    if (
      chatContainerRef.current &&
      chatContainerRef.current.scrollHeight -
        chatContainerRef.current.clientHeight !==
        0
    ) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const fetchMessages = (beforeParam = null, afterParam = null) => {
    setIsMessagesLoading(true);
    httpRequest({
      url: `api/v1/accounts/${accountId}/conversations/${selectedConversationId}/messages`,
      method: 'get',
      params: { before: beforeParam, after: afterParam },
    })
      .then((response) => {
        const modifiedResponse = {
          ...response,
          data: {
            ...response.data,
            payload: response.data.payload.reverse(),
          },
        };
        if (modifiedResponse.data.payload.length === 0) {
          setIsDataEmpty(true);
          setIsMessagesLoading(false);
        } else if (beforeParam) {
          setIsDataEmpty(false);
          setIsMessagesLoading(false);
          setMessages((prevState: any) => {
            return {
              ...prevState,
              payload: [...prevState.payload, ...modifiedResponse.data.payload],
            };
          });
        } else {
          setIsDataEmpty(false);
          setIsMessagesLoading(false);
          setMessages(modifiedResponse.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getMessages = () => {
    if (messages && messages.payload.length >= 20) {
      fetchMessages(messages.payload[messages.payload.length - 1].id);
    }
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

  const sendMessage = (data: MessageForm) => {
    setIsMessageSending(true);
    const messageData = {
      content: data.message,
      private: false,
      message_type: 'outgoing',
    };
    httpRequest({
      url: `api/v1/accounts/${accountId}/conversations/${selectedConversationId}/messages`,
      method: 'post',
      data: messageData,
    })
      .then((response: any) => {
        setMessages((prevData: any) => {
          return { ...prevData, payload: [response.data, ...prevData.payload] };
        });
        setIsMessageSending(false);
        updateDashboardState((prevState: DashBoardState) => {
          return { ...prevState, postedMessageId: response.data.id };
        });
        chatContainerRef.current?.scrollTo({
          top: chatContainerRef.current.scrollHeight,
        });
      })
      .catch((error) => {
        console.error(error);
        setIsMessageSending(false);
      });
    methods.reset();
  };

  const updateMessageSeen = () => {
    httpRequest({
      url: `api/v1/accounts/${accountId}/conversations/${selectedConversationId}/update_last_seen`,
      method: 'post',
    })
      .then((response) => {
        updateDashboardState((prevState: DashBoardState) => {
          return { ...prevState, messageSeenId: response.data.id };
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className='relative h-100'>
      {!selectedConversationId && !isMessagesLoading && (
        <div className='center-el text-center'>
          <div className='flex flex-column items-center'>
            <IoLogoSnapchat size={70} />
            <h4>Please select a conversation</h4>
          </div>
        </div>
      )}

      {isMessagesLoading && (
        <div className='center-el'>
          <div className='spinner-border spinner-border-md'></div>
        </div>
      )}

      {messages && selectedConversationId && (
        <div className='h-screen flex flex-col'>
          <div className='flex flex-row items-center bg-[#151718] p-2 position-sticky top-0'>
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
                  {getInboxName(selectedConversationId)}
                </small>
              </div>
            </div>
          </div>

          <div
            className='px-3 pt-3 h-full'
            ref={chatContainerRef}
            id='scrollableDiv'
            style={{
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column-reverse',
            }}
          >
            <InfiniteScroll
              key={selectedConversationId}
              dataLength={messages.payload.length ?? 0}
              next={getMessages}
              style={{
                display: 'flex',
                flexDirection: 'column-reverse',
                overflow: 'hidden',
              }}
              inverse={true}
              hasMore={true && !isDataEmpty}
              loader={<></>}
              scrollableTarget='scrollableDiv'
              endMessage={
                <small className='text-center text-[#787f85] font-semibold'>
                  All messages loaded
                </small>
              }
            >
              {messages.payload.map((message: any, index: number) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    message.message_type === 0
                      ? 'bg-gray-300 self-start text-dark rounded-r-lg'
                      : 'bg-blue-500 self-end rounded-l-lg'
                  } p-2 rounded-t-md h-ful whitespace-normal`}
                >
                  <p className='m-0'>{message.content}</p>
                  <small className='text-xs'>
                    {new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    }).format(new Date(+message.created_at * 1000))}
                  </small>
                </div>
              ))}
            </InfiniteScroll>
          </div>
          <div className='position-sticky bottom-0 p-3'>
            <form onSubmit={methods.handleSubmit(sendMessage)}>
              <div className='flex'>
                <input
                  type='text'
                  id='message'
                  className='block w-full rounded-tl-md rounded-bl-md py-1.5 pl-5 pr-20 text-gray-900 placeholder:text-gray-500 sm:text-sm sm:leading-6 outline-none border-3 focus:border-blue-500 bg-gray-300'
                  placeholder='Type to send a message'
                  {...methods.register('message', {
                    required: true,
                  })}
                  autoComplete='off'
                />
                <button
                  type='submit'
                  className={`rounded-tr-md rounded-br-md  p-1 ${
                    !isValid ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-400'
                  }`}
                  disabled={!isValid || isMessageSending}
                >
                  <IoSendSharp className='text-black h-full' size={25} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ChatScreen);
