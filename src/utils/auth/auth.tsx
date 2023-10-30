import React, { createContext, useContext, useState } from 'react';
import {
  AuthProviderProps,
  LoginResponse,
} from '../../shared/models/shared.model';

type AuthContextType = {
  userDetails: LoginResponse | {} | string;
  setLoggedInUser: (loginResponse: LoginResponse) => any;
  removeLoggedInUser: () => void;
  getUserToken: () => string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userDetails, setUserDetails] = useState<LoginResponse | {}>({});

  const setLoggedInUser = (loginResponse: LoginResponse) => {
    console.log('login-response', loginResponse);
    localStorage.setItem('access_token', loginResponse.access_token);
    setUserDetails(loginResponse);
    console.log(userDetails);
  };

  const removeLoggedInUser = () => {
    localStorage.removeItem('access_token');
  };

  const getUserToken = () => {
    return localStorage.getItem('access_token');
  };

  return (
    <AuthContext.Provider
      value={{ userDetails, setLoggedInUser, removeLoggedInUser, getUserToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType | null => {
  return useContext(AuthContext);
};
