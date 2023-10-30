import { useAuthContext } from '../../../utils/auth/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const authContext = useAuthContext();
  const navigate = useNavigate();
  const logout = () => {
    authContext?.removeLoggedInUser();
    navigate('/login');
  };

  return (
    <>
      <h1>Dashboard works</h1>
      <button onClick={logout}>logout</button>
    </>
  );
};

export default Dashboard;
