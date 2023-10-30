import { Navigate } from 'react-router-dom';
import { AuthProviderProps } from '../../../shared/models/shared.model';
import { useAuthContext } from '../../../utils/auth/auth';

export const RequireAuth: React.FC<AuthProviderProps> = ({ children }) => {
  const authContext = useAuthContext();

  if (!authContext?.getUserToken()) {
    return <Navigate to='/login'></Navigate>;
  }
  return children;
};
