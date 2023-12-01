import { ChildrenComponentProps } from '../../../shared/models/shared.model';
import { useAuthContext } from '../../../utils/auth/auth';
import { Navigate } from 'react-router-dom';

const UnAuth: React.FC<ChildrenComponentProps> = ({ children }) => {
  const authContext = useAuthContext();

  if (!authContext?.getUserToken()) {
    return children;
  }
  return <Navigate to='/' />;
};

export default UnAuth;
