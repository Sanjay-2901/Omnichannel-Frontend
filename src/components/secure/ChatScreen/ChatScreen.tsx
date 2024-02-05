import React, { useEffect, useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDashboardContext } from '../../../providers/DashboardProvider';
import { httpRequest } from '../../../utils/axios-utils';
import { useAuthContext } from '../../../utils/auth/AuthProvider';
import { IoLogoSnapchat } from 'react-icons/io';
import { IoSendSharp } from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import './ChatScreen.scss';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { LuCopy } from 'react-icons/lu';
import { toast } from 'react-toastify';
import copy from 'clipboard-copy';
import Alert from '../AlertModal/AlertModal';
import {
  SUCCESS_TOAST_CONFIG,
  SUCCESS_TOAST_TOP_CONFIG,
} from '../../../constants/constants';
import ChatScreenHeader from '../ChatScreenHeader/ChatScreenHeader';

type MessageForm = {
  message: string;
};

const ChatScreen = () => {
  const DashboardContext = useDashboardContext();
  const { dashBoardState, messages, setMessages, replaceConversation } =
    DashboardContext;
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
  const [showMessageOptions, setShowMessageOptions] = useState<number | null>(
    null
  );
  const [showAlert, setShowAlert] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages();
      updateMessageSeen();
    }
  }, [selectedConversationId]);

  useEffect(() => {
    const { receivedMessage, selectedConversationId } = dashBoardState;
    if (
      receivedMessage?.conversation_id === selectedConversationId &&
      messages
    ) {
      updateMessageSeen();
      const isNewMessage = messages.payload.find(
        (message: any) => message.id === receivedMessage.id
      );
      if (!isNewMessage) {
        setMessages((prevData: any) => ({
          ...prevData,
          payload: [receivedMessage, ...prevData.payload],
        }));

        chatContainerRef.current?.scrollTo({
          top: chatContainerRef.current.scrollHeight,
        });
      } else {
        setMessages((prevState: any) => ({
          ...prevState,
          payload: prevState.payload.map((message: any) =>
            message.id === receivedMessage.id ? receivedMessage : message
          ),
        }));
      }
    }
  }, [dashBoardState.receivedMessage]);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (showMessageOptions && event.target.closest('.message') === null) {
        setShowMessageOptions(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [showMessageOptions]);

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
          setMessages(modifiedResponse.data);
          setIsDataEmpty(false);
          setIsMessagesLoading(false);
          scrollToBottom();
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
        updateMessageSeen(true);
        chatContainerRef.current?.scrollTo({
          top: chatContainerRef.current.scrollHeight,
        });
      })
      .catch(() => {
        toast.error('Something went wrong');
      })
      .finally(() => {
        setIsMessageSending(false);
      });
    methods.reset();
  };

  const updateMessageSeen = (isNewMessageSent: null | boolean = null) => {
    httpRequest({
      url: `api/v1/accounts/${accountId}/conversations/${selectedConversationId}/update_last_seen`,
      method: 'post',
    })
      .then((response) => {
        replaceConversation(response.data, isNewMessageSent);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const openMessageOptions = (messageId: number) => {
    setShowMessageOptions(messageId);
    setSelectedMessageId(messageId);
  };

  const deleteMessage = () => {
    httpRequest({
      url: `api/v1/accounts/${accountId}/conversations/${selectedConversationId}/messages/${selectedMessageId}`,
      method: 'delete',
    })
      .then(() => {
        toast.success('Message deleted successfully', SUCCESS_TOAST_CONFIG);
      })
      .catch(() => {
        toast.error('Please try again later');
      })
      .finally(() => {
        setShowAlert(false);
      });
  };

  const copyMessage = async (message: string) => {
    try {
      await copy(message);
      toast.success('Message copied to clipboard', SUCCESS_TOAST_TOP_CONFIG);
    } catch {
      toast.error('Cannot copy message to clipboard');
    }
  };

  return (
    <>
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
          <div className='center-el z-30'>
            <div className='spinner-border spinner-border-md'></div>
          </div>
        )}

        {messages && selectedConversationId && (
          <div className='h-screen flex flex-col'>
            <ChatScreenHeader />
            <div
              className='px-3 pt-3 h-full relative'
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
                {messages.payload.map((message: any) => {
                  const receivedMessageType = message.message_type;
                  return (
                    <div
                      key={message.id}
                      className={`flex relative ${
                        receivedMessageType === 0
                          ? 'self-start'
                          : receivedMessageType === 1
                          ? 'self-end flex-row-reverse'
                          : 'self-center'
                      }`}
                    >
                      <div
                        className={`mt-2 ${
                          receivedMessageType === 0
                            ? 'bg-gray-300  text-dark rounded-r-lg mr-2 p-2'
                            : receivedMessageType === 1
                            ? 'bg-blue-500  rounded-l-lg ml-2 p-2'
                            : 'bg-[#687076] flex items-center gap-2 rounded-md p-1'
                        } rounded-t-md whitespace-normal`}
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
                      {!message.content_attributes?.deleted &&
                        receivedMessageType !== 2 && (
                          <div
                            className='cursor-pointer hover:bg-[#787f85] self-end p-1 rounded-sm message'
                            onClick={() => {
                              openMessageOptions(message.id);
                            }}
                          >
                            <HiOutlineDotsVertical />
                          </div>
                        )}
                      {showMessageOptions === message.id && (
                        <div
                          className={`bg-[#151718] py-2 rounded-md absolute -bottom-0 z-10 w-28 ${
                            receivedMessageType === 0 ? 'right-0' : 'left-0'
                          }`}
                        >
                          <ul className='p-0 m-0'>
                            <li
                              className='py-1 hover:bg-[#292b29] pl-2 pr-3 cursor-pointer flex items-center'
                              onClick={() => {
                                setShowAlert(true);
                              }}
                            >
                              <RiDeleteBin6Line />
                              <small className='pl-1'>Delete</small>
                            </li>
                            <li
                              className='hover:bg-[#292b29] pl-2 pr-3 cursor-pointer flex items-center py-1'
                              onClick={() => {
                                copyMessage(message.content);
                              }}
                            >
                              <LuCopy />
                              <small className='pl-1'>Copy</small>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
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
                      !isValid
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-400'
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
      {showAlert && (
        <Alert
          message={'Are you sure you want to delete this message?'}
          confirm={deleteMessage}
          setShowAlert={setShowAlert}
        />
      )}
    </>
  );
};

export default React.memo(ChatScreen);
