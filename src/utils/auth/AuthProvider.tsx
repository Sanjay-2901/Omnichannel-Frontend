import React, { createContext, useContext } from 'react';
import {
  ChildrenComponentProps,
  LoginResponse,
} from '../../shared/models/shared.model';
import { httpRequest } from '../axios-utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type AuthContextType = {
  setLoggedInUser: (loginResponse: LoginResponse) => any;
  removeLoggedInUser: () => void;
  getUserToken: () => any | null;
  getUserDetails: () => LoginResponse | any;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<ChildrenComponentProps> = ({
  children,
}) => {
  const navigate = useNavigate();

  const setLoggedInUser = (loginResponse: any) => {
    localStorage.setItem(
      'authorization_token',
      loginResponse.headers.authorization
    );
    localStorage.setItem('access_token', loginResponse.data.data.access_token);
    localStorage.setItem(
      'userDetails',
      JSON.stringify(loginResponse.data.data)
    );
  };

  const removeLoggedInUser = () => {
    httpRequest({
      url: 'auth/sign_out',
      method: 'delete',
    })
      .then(() => {
        navigate('/login');
        toast.success('Logged out successfully');
      })
      .catch(() => {
        toast.success('Logged out successfully');
        navigate('/login');
      });
    localStorage.clear();
  };

  const getUserToken = () => {
    return localStorage.getItem('access_token');
  };

  const getUserDetails = () => {
    let userDetails = localStorage.getItem('userDetails');
    if (userDetails) return JSON.parse(userDetails);
  };

  return (
    <AuthContext.Provider
      value={{
        getUserDetails,
        setLoggedInUser,
        removeLoggedInUser,
        getUserToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType | null => {
  return useContext(AuthContext);
};
