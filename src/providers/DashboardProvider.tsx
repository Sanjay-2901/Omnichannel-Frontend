import { createContext, useContext, useEffect, useState } from 'react';
import {
  ChildrenComponentProps,
  DashBoardState,
} from '../shared/models/shared.model';
import { useAuthContext } from '../utils/auth/AuthProvider';

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
    <DashboardContext.Provider value={{ dashBoardState, updateDashboardState }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  return useContext(DashboardContext);
};

export default DashboardProvider;
