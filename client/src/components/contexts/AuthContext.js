import React, { createContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (cookies.AuthToken) {
      setLoggedIn(true);
    }
  }, [cookies.AuthToken]);


  const login = () => {
    setLoggedIn(true);
  };

  const logout = () => {
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
