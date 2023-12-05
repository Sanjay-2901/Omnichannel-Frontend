import { useState, useEffect } from 'react';
import { useAuthContext } from '../../../utils/auth/auth';
import { httpRequest } from '../../../utils/axios-utils';

const ConversationsList = () => {
  const authContext = useAuthContext();
  const [conversationList, setInboxList] = useState<any>(null);

  useEffect(() => {
    httpRequest({
      url: `api/v1/accounts/${
        authContext?.getUserDetails().account_id
      }/conversations`,
      method: 'get',
    }).then((response) => {
      console.log(response);
      setInboxList(response.data.data.payload);
    });
  }, []);

  return (
    <>
      {conversationList && (
        <div>
          <h4>Conversations</h4>
          {conversationList.map((conversation: any, index: number) => (
            <div key={index}>
              <h6>{conversation.meta.sender.name}</h6>
              <p>{conversation.messages[0].content}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ConversationsList;
