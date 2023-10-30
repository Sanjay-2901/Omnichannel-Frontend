import { useAuthContext } from '../../../utils/auth/auth';
import { Navigate } from 'react-router-dom';

const UnAuth: any = ({ children }: any) => {
  const authContext = useAuthContext();

  if (!authContext?.getUserToken()) {
    return children;
  }
  return <Navigate to='/' />;
};

export default UnAuth;
