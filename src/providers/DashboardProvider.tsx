import { createContext, useContext, useState } from 'react';
import {
  ChildrenComponentProps,
  DashBoardState,
} from '../shared/models/shared.model';

const DashboardContext = createContext<null | any>(null);

const DashboardProvider: React.FC<ChildrenComponentProps> = ({ children }) => {
  const [dashBoardState, updateDashboardState] = useState<DashBoardState>({
    inboxId: null,
    conversationId: null,
    selectedConversationId: null,
  });

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
