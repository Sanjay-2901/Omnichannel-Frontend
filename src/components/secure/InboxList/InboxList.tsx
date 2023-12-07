import { useEffect, useState } from 'react';
import { useAuthContext } from '../../../utils/auth/AuthProvider';
import { httpRequest } from '../../../utils/axios-utils';
import { useDashboardContext } from '../../../providers/DashboardProvider';
import { DashBoardState } from '../../../shared/models/shared.model';
import { FaTelegram } from 'react-icons/fa';
import { TbWorldWww } from 'react-icons/tb';
import { MdOutlineMail } from 'react-icons/md';
import './InboxList.scss';

type IconKey = 'Telegram' | 'Email' | 'WebWidget';

const InboxList = () => {
  const [inboxList, setInboxList] = useState<any>(null);
  const authContext = useAuthContext();
  const dashboardContext = useDashboardContext();
  const icons = {
    Telegram: <FaTelegram />,
    Email: <MdOutlineMail />,
    WebWidget: <TbWorldWww />,
  };

  useEffect(() => {
    httpRequest({
      url: `api/v1/accounts/${
        authContext?.getUserDetails().account_id
      }/inboxes`,
      method: 'get',
    }).then((response) => {
      setInboxList(response.data.payload);
    });
  }, []);

  const getIcons = (channel: IconKey): any => {
    return icons[channel] || <FaTelegram />;
  };

  return (
    <>
      {inboxList && (
        <div>
          <h4 className='mb-3'>Inboxes</h4>
          <ul className='p-0 m-0'>
            {inboxList.map((inboxItem: any, index: number) => (
              <li
                key={index}
                className={`cursor-pointer p-1 rounded-md hover:bg-[#26292B] mb-1 flex flex-row items-center ${
                  dashboardContext.dashBoardState.inboxId === inboxItem.id &&
                  'bg-[#26292B]'
                }`}
                onClick={() => {
                  dashboardContext.updateDashboardState(
                    (prevDashboardState: DashBoardState) => {
                      return { ...prevDashboardState, inboxId: inboxItem.id };
                    }
                  );
                }}
              >
                <span className='pr-2'>
                  {getIcons(inboxItem.channel_type.slice(9))}
                </span>
                {inboxItem.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default InboxList;
