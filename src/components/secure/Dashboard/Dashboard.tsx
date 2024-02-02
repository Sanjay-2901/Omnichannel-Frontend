import React, { useEffect } from 'react';
import { useDashboardContext } from '../../../providers/DashboardProvider';
import ChatScreen from '../ChatScreen/ChatScreen';
import ConversationsList from '../ConversationsList/ConversationsList';
import InboxList from '../InboxList/InboxList';
import './Dashboard.scss';
import { DashBoardState } from '../../../shared/models/shared.model';

const Dashboard = () => {
  const dashboardContext = useDashboardContext();
  const { dashBoardState, updateDashboardState, debounce } = dashboardContext;

  const checkScreenSize = () => {
    if (window.innerWidth < 1024) {
      updateDashboardState((prevState: DashBoardState) => {
        return { ...prevState, showInboxes: false };
      });
    }
  };

  const debouncedCheckScreenSize = debounce(checkScreenSize, 300);

  useEffect(() => {
    window.addEventListener('resize', debouncedCheckScreenSize);

    return () => {
      window.removeEventListener('resize', debouncedCheckScreenSize);
    };
  }, []);

  return (
    <div className='bg-neutral-300 flex h-full'>
      <div
        className={`${
          dashBoardState.showInboxes ? 'block' : 'hidden lg:block'
        } p-2 bg pt-3 md:w-1/5`}
      >
        <InboxList />
      </div>
      <div
        className={`${
          dashBoardState.selectedConversationId && 'hidden lg:block'
        } p-2 bg border-l pt-3 w-full lg:w-4/12`}
      >
        <ConversationsList />
      </div>
      <div
        className={`${
          !dashBoardState.selectedConversationId && 'hidden lg:block'
        } bg-chat w-full lg:w-3/5`}
      >
        <ChatScreen />
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
