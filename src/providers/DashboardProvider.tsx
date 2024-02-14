import {
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from 'react';
import {
  Inbox,
  IconKey,
  Conversation,
  DashBoardState,
  ConversationDetail,
  ChildrenComponentProps,
} from '../shared/models/shared.model';
import { useAuthContext } from '../utils/auth/AuthProvider';
import { FaTelegram } from 'react-icons/fa';
import { MdOutlineMail } from 'react-icons/md';
import { TbWorldWww } from 'react-icons/tb';
import React from 'react';
import { MESSAGE_TYPE, WEBSOCKET_EVENTS } from '../enums/enums';
import { environment } from '../environments/environment';

const DashboardContext = createContext<null | any>(null);
const DashboardProvider: React.FC<ChildrenComponentProps> = ({ children }) => {
  const authContext = useAuthContext();
  const userDetails = authContext?.getUserDetails();
  const webSocketMessage = `{"command":"subscribe",
  "identifier":"{\\"channel\\":\\"RoomChannel\\",\\"pubsub_token\\":\\"${userDetails.pubsub_token}\\",\\"account_id\\":${userDetails.account_id},\\"user_id\\":${userDetails.id}}"
  }`;
  const [dashBoardState, updateDashboardState] = useState<DashBoardState>({
    selectedInboxId: null,
    selectedConversationId: null,
    receivedMessage: null,
    showInboxes: false,
    searchedMessageId: null,
    assigneeType: 'Mine',
    newConversationId: null,
  });
  const [messages, setMessages] = useState<any | null>(null);
  const [inboxList, setInboxList] = useState([]);
  const [conversationList, setConversationList] = useState<
    Conversation[] | any
  >([]);
  const [conversationDetail, setConversationDetail] =
    useState<null | ConversationDetail>(null);

  const icons = {
    Telegram: <FaTelegram />,
    Email: <MdOutlineMail />,
    WebWidget: <TbWorldWww />,
  };

  const getConversationDetails = useCallback(
    (conversationId: number): undefined | ConversationDetail => {
      const conversation: Conversation = conversationList.find(
        (conversation: Conversation) => conversation.id === conversationId
      );
      const inbox: any = inboxList.find(
        (inbox: Inbox) => inbox.id === conversation?.messages[0].inbox_id
      );
      if (conversation && inbox) {
        return {
          inbox_name: inbox?.name,
          channel_type: conversation?.meta.channel.slice(9),
          conversation_status: conversation?.status,
        };
      }
    },
    [conversationList, inboxList]
  );

  const replaceConversation = (
    conversation: Conversation,
    isNewMessageSent: null | boolean = null
  ): void => {
    setConversationList((prevState: Conversation[]) => {
      const index = prevState.findIndex((conversationItem: Conversation) => {
        return conversationItem.id === conversation.id;
      });
      if (index === -1) return prevState;
      const newList = [...prevState];
      if (isNewMessageSent) {
        newList.splice(index, 1);
        newList.unshift(conversation);
      } else {
        newList[index] = conversation;
      }
      return newList;
    });
  };

  useEffect(() => {
    if (!dashBoardState.selectedConversationId) return;
    const conversationDetail = getConversationDetails(
      dashBoardState.selectedConversationId
    );
    if (conversationDetail) {
      setConversationDetail(conversationDetail);
    }
  }, [
    conversationList,
    dashBoardState.selectedConversationId,
    getConversationDetails,
  ]);

  const getIcons = (channel: IconKey): any => {
    return icons[channel] || <FaTelegram />;
  };

  useEffect(() => {
    const webSocket = new WebSocket(environment.webSocketUrl);

    webSocket.onopen = () => {
      if (webSocket.readyState === webSocket.OPEN) {
        webSocket.send(webSocketMessage);
      }
    };

    webSocket.onmessage = (event) => {
      const parsedEvent = JSON.parse(event.data);
      const messageEvent = parsedEvent.message?.event;
      const messageType = parsedEvent.message?.data?.message_type;
      const latestMessage = parsedEvent.message?.data;

      if (
        !parsedEvent ||
        (messageType === MESSAGE_TYPE.SENT &&
          latestMessage.content !== WEBSOCKET_EVENTS.MESSAGE_DELETED)
      )
        return;
      if (messageType === WEBSOCKET_EVENTS.CONVERSATION_CREATED) {
        updateDashboardState((prevState: DashBoardState) => {
          return { ...prevState, newConversationId: latestMessage.id };
        });
      }
      if (
        (messageEvent === WEBSOCKET_EVENTS.MESSAGE_UPDATED &&
          messageType !== MESSAGE_TYPE.INFORMATION) ||
        (messageEvent === WEBSOCKET_EVENTS.MESSAGE_CREATED &&
          messageType === MESSAGE_TYPE.INFORMATION) ||
        (messageEvent === WEBSOCKET_EVENTS.MESSAGE_CREATED &&
          latestMessage.hasOwnProperty('attachments'))
      ) {
        updateDashboardState((prevState: DashBoardState) => {
          return { ...prevState, receivedMessage: latestMessage };
        });
      }
    };

    return () => {
      if (webSocket.readyState === WebSocket.OPEN) {
        webSocket.close();
      }
    };
  }, [webSocketMessage]);

  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const formatTimePeriod = (timestamp: number) => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const secondsAgo = currentTimestamp - timestamp;
    const intervals = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };
    const interval = Object.entries(intervals).find(
      ([unit, seconds]) => secondsAgo >= seconds
    );
    return interval
      ? `${Math.floor(secondsAgo / interval[1])} ${interval[0]}${
          Math.floor(secondsAgo / interval[1]) === 1 ? '' : 's'
        } ago`
      : 'Just now';
  };

  return (
    <DashboardContext.Provider
      value={{
        dashBoardState,
        inboxList,
        conversationList,
        conversationDetail,
        messages,
        updateDashboardState,
        setInboxList,
        setConversationList,
        getIcons,
        getConversationDetails,
        debounce,
        formatTimePeriod,
        setConversationDetail,
        setMessages,
        replaceConversation,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  return useContext(DashboardContext);
};

export default React.memo(DashboardProvider);
