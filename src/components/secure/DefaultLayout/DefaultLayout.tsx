import Sidebar from '../Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

const DefaultLayout = () => {
  return (
    <>
      <div className='main-container p-0 h-screen'>
        <Sidebar />
        <div className='w-100'>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default DefaultLayout;
