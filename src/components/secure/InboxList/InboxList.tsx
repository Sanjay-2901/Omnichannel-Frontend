import { useEffect, useState } from 'react';
import { useAuthContext } from '../../../utils/auth/auth';
import { httpRequest } from '../../../utils/axios-utils';

const InboxList = () => {
  const authContext = useAuthContext();
  const [inboxList, setInboxList] = useState<any>(null);

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

  return (
    <>
      {inboxList && (
        <div>
          <h4 className='mb-3'>Inboxes</h4>
          {inboxList.map((inboxItem: any, index: number) => (
            <div className='cursor-pointer'>
              <h6 key={index}>{inboxItem.name}</h6>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default InboxList;
