import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  type {ReactNode} from "react"
type AuthContextType = {
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  const setToken = (t: string | null) => {
    setTokenState(t);
  };

  const logout = () => {
    setTokenState(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
