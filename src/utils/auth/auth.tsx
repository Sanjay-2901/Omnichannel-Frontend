import React, { createContext, useContext, useState } from 'react';
import {
  ChildrenComponentProps,
  LoginResponse,
} from '../../shared/models/shared.model';
import { httpRequest } from '../axios-utils';

type AuthContextType = {
  // userDetails: LoginResponse | {} | string;
  setLoggedInUser: (loginResponse: LoginResponse) => any;
  removeLoggedInUser: () => void;
  getUserToken: () => any | null;
  getUserDetails: () => LoginResponse | any;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<ChildrenComponentProps> = ({
  children,
}) => {
  // const [userDetails, setUserDetails] = useState<LoginResponse | {}>({});

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

    // setUserDetails(loginResponse.data.data);
  };

  const removeLoggedInUser = () => {
    httpRequest({
      url: 'auth/sign_out',
      method: 'delete',
    }).then((response) => {
      console.log(response);
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
