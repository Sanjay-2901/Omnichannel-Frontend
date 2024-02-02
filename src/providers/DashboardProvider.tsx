import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  ChildrenComponentProps,
  Conversation,
  ConversationDetail,
  DashBoardState,
  IconKey,
  Inbox,
} from '../shared/models/shared.model';
import { useAuthContext } from '../utils/auth/AuthProvider';
import { FaTelegram } from 'react-icons/fa';
import { MdOutlineMail } from 'react-icons/md';
import { TbWorldWww } from 'react-icons/tb';
import React from 'react';
import { WEBSOCKET_EVENTS } from '../enums/enums';
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

  const replaceConversation = (conversation: Conversation): void => {
    setConversationList((prevState: Conversation[]) => {
      const index = prevState.findIndex((conversationItem: Conversation) => {
        return conversationItem.id === conversation.id;
      });
      if (index !== 1) {
        const newList = [...prevState];
        newList[index] = conversation;
        return newList;
      } else {
        return prevState;
      }
    });
  };

  const replaceConversationToTop = (
    conversationId: number,
    newContent: string
  ) => {
    setConversationList((prevState: Conversation[]) => {
      const index = prevState.findIndex((conversationItem: Conversation) => {
        return conversationItem.id === conversationId;
      });
      if (index !== -1) {
        const newList = [...prevState];
        const conversationToUpdate = { ...newList[index] };
        conversationToUpdate.last_non_activity_message.content = newContent;
        newList.splice(index, 1);
        newList.unshift(conversationToUpdate);
        return newList;
      } else {
        return prevState;
      }
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
      if (
        (parsedEvent.message?.event === WEBSOCKET_EVENTS.MESSAGE_UPDATED &&
          parsedEvent.message?.data.message_type !== 2) ||
        (parsedEvent.message?.event === WEBSOCKET_EVENTS.MESSAGE_CREATED &&
          parsedEvent.message?.data.message_type === 2)
      ) {
        updateDashboardState((prevState: DashBoardState) => {
          return { ...prevState, receivedMessage: parsedEvent.message.data };
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
        replaceConversationToTop,
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
