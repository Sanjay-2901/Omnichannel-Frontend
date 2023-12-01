import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../../utils/auth/auth';
import { ChildrenComponentProps } from '../../../shared/models/shared.model';

export const RequireAuth: React.FC<ChildrenComponentProps> = ({ children }) => {
  const authContext = useAuthContext();

  if (!authContext?.getUserToken()) {
    return <Navigate to='/login'></Navigate>;
  }
  return children;
};
