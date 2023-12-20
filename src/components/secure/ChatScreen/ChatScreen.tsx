import { useEffect, useRef, useState } from 'react';
import { useDashboardContext } from '../../../providers/DashboardProvider';
import { IoLogoSnapchat } from 'react-icons/io';
import { httpRequest } from '../../../utils/axios-utils';
import { useAuthContext } from '../../../utils/auth/AuthProvider';
import { IoSendSharp } from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import './ChatScreen.scss';
import { DashBoardState } from '../../../shared/models/shared.model';
import { IoChevronBackSharp } from 'react-icons/io5';

type MessageForm = {
  message: string;
};

const ChatScreen = () => {
  const dashboardContext = useDashboardContext();
  const authContext = useAuthContext();
  const { dashBoardState, updateDashboardState } = dashboardContext;
  const [messages, setMessages] = useState<any>(null);
  const [isMessageSending, setIsMessageSending] = useState(false);
  const accountId = authContext?.getUserDetails().account_id;
  const { selectedConversationId } = dashBoardState;
  const methods = useForm<MessageForm>({
    defaultValues: {
      message: '',
    },
  });
  const { isValid } = methods.formState;
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);

  useEffect(() => {
    if (selectedConversationId) {
      getMessages();
      updateMessageSeen();
    }
  }, [dashBoardState.selectedConversationId]);

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
          payload: [...prevData.payload, dashBoardState.receivedMessage],
        };
      });
      setTimeout(() => {
        chatContainerRef.current?.scrollTo({
          top: chatContainerRef.current.scrollHeight,
        });
      }, 0);
    }
  }, [dashBoardState.receivedMessage]);

  useEffect(() => {
    if (messages) {
      if (messages.payload.length <= 20) {
        scrollToBottom();
      }
      setPrevScrollHeight(chatContainerRef.current?.scrollHeight ?? 0);
    }

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);

      return () => chatContainer.removeEventListener('scroll', handleScroll);
    }
  }, [messages]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const currentScrollTop = chatContainerRef.current.scrollTop;
      if (
        currentScrollTop === 0 &&
        chatContainerRef.current.scrollHeight -
          chatContainerRef.current.clientHeight !==
          0
      ) {
        getMessages(messages.payload[0].id);
      }
    }
  };

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

  const getMessages = (param = null) => {
    if (dashBoardState.selectedConversationId) {
      httpRequest({
        url: `api/v1/accounts/${accountId}/conversations/${selectedConversationId}/messages`,
        method: 'get',
        params: { before: param },
      })
        .then((response) => {
          if (response.data.payload.length > 0 && !param) {
            setMessages(response.data);
          } else if (response.data.payload.length > 0 && param) {
            setMessages((prevState: any) => {
              return {
                ...prevState,
                payload: [...response.data.payload, ...prevState.payload],
              };
            });
            chatContainerRef.current?.scrollTo({
              top: chatContainerRef.current.scrollHeight - prevScrollHeight,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
          return { ...prevData, payload: [...prevData.payload, response.data] };
        });
        setIsMessageSending(false);
        updateDashboardState((prevState: DashBoardState) => {
          return { ...prevState, postedMessageId: response.data.id };
        });
        setTimeout(() => {
          chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
          });
        }, 0);
      })
      .catch((error) => {
        console.log(error);
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

  const goBack = () => {
    updateDashboardState((prevState: DashBoardState) => {
      return { ...prevState, selectedConversationId: null };
    });
    setMessages(null);
  };

  return (
    <>
      {!selectedConversationId && (
        <div className='flex items-center justify-center h-100'>
          <div className='flex flex-column items-center'>
            <IoLogoSnapchat size={70} />
            <h4>Please select a conversation</h4>
          </div>
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
              <h6 className='mb-1'>{messages.meta.contact.name}</h6>
            </div>
          </div>

          <div
            className='flex flex-col px-3 pt-3 h-full overflow-y-auto'
            ref={chatContainerRef}
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
    </>
  );
};

export default ChatScreen;
