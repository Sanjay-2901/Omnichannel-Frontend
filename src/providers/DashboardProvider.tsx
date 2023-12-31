import { createContext, useContext, useEffect, useState } from 'react';
import {
  ChildrenComponentProps,
  Conversation,
  DashBoardState,
  IconKey,
  Inbox,
} from '../shared/models/shared.model';
import { useAuthContext } from '../utils/auth/AuthProvider';
import { FaTelegram } from 'react-icons/fa';
import { MdOutlineMail } from 'react-icons/md';
import { TbWorldWww } from 'react-icons/tb';

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
    postedMessageId: null,
    messageSeenId: null,
    showInboxes: false,
  });
  const [inboxList, setInboxList] = useState([]);
  const [conversationList, setConversationList] = useState<any>([]);

  const icons = {
    Telegram: <FaTelegram />,
    Email: <MdOutlineMail />,
    WebWidget: <TbWorldWww />,
  };

  const getIcons = (channel: IconKey): any => {
    return icons[channel] || <FaTelegram />;
  };

  const getInboxName = (conversationId: number): any => {
    const conversation = conversationList.find(
      (conversation: Conversation) => conversation.id === conversationId
    );
    const inbox: any = inboxList.find(
      (inbox: Inbox) => inbox.id === conversation.messages[0].inbox_id
    );
    return inbox.name;
  };

  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:3000/cable');

    webSocket.onopen = () => {
      if (webSocket.readyState === webSocket.OPEN) {
        webSocket.send(webSocketMessage);
      }
    };

    webSocket.onmessage = (event) => {
      const parsedEvent = JSON.parse(event.data);
      if (
        parsedEvent.message?.event === 'message.updated' &&
        parsedEvent.message?.data.message_type === 0
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

  return (
    <DashboardContext.Provider
      value={{
        dashBoardState,
        updateDashboardState,
        inboxList,
        setInboxList,
        conversationList,
        setConversationList,
        getIcons,
        getInboxName,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  return useContext(DashboardContext);
};

export default DashboardProvider;
