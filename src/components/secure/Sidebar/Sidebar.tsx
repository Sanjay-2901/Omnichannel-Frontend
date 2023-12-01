import { NavLink } from 'react-router-dom';
import { FaBars, FaRocketchat, FaUnlock, FaInbox } from 'react-icons/fa';
import { useState } from 'react';
import './Sidebar.scss';
import { useAuthContext } from '../../../utils/auth/auth';
import { useNavigate } from 'react-router-dom';

const SideBar = () => {
  const menuItems = [
    {
      path: '/conversations',
      name: 'Conversations',
      icon: <FaRocketchat />,
    },
    {
      path: '/inboxes',
      name: 'Inboxes',
      icon: <FaInbox />,
    },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const authContext = useAuthContext();
  const navigate = useNavigate();
  const onSignOut = () => {
    authContext?.removeLoggedInUser();
    navigate('/login');
  };

  return (
    <div className='main-container'>
      <div style={{ width: isOpen ? '200px' : '50px' }} className='sidebar'>
        <div className='top_section'>
          <h1 style={{ display: isOpen ? 'block' : 'none' }} className='logo'>
            OC
          </h1>
          <div style={{ marginLeft: isOpen ? '50px' : '0px' }} className='bars'>
            <FaBars onClick={toggle} />
          </div>
        </div>
        {menuItems.map((item, index) => (
          <NavLink to={item.path} key={index} className='link'>
            <div className='icon'>{item.icon}</div>
            <div
              style={{ display: isOpen ? 'block' : 'none' }}
              className='link_text'
            >
              {item.name}
            </div>
          </NavLink>
        ))}
        <div className='link'>
          <div
            className='icon'
            onClick={() => {
              onSignOut();
            }}
          >
            <FaUnlock />
          </div>
          <div
            style={{ display: isOpen ? 'block' : 'none', cursor: 'pointer' }}
            className='mt-2'
            onClick={() => {
              onSignOut();
            }}
          >
            SignOut
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
