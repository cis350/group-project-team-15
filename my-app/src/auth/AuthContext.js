import React, { createContext, useState, useContext } from 'react';

import { useNavigate } from "react-router-dom";
import { loginCall } from '../api/login';

const AuthContext = createContext();

const defaultAuthValue = {
  isLoggedIn: false,
  email: '',
  login: async () => {}, // Placeholder function
  logout: async () => {}, // Placeholder function
  message: ''
};

export const useAuth = () => {
  return useContext(AuthContext) || defaultAuthValue;
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('appToken'));
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function callLogin(email, password) {
    const { success, errorMessage } = await loginCall(email, password);

    setIsLoggedIn(success);
    setMessage(errorMessage);

    if (success) {
      setEmail(email);
      setMessage("");
      console.log(`${email} logged in!`);
      navigate(`/profile/${email}`);
    } else {
      setMessage(errorMessage);
    }
  }

  const login = (data) => {
    // TODO: login stuff lol!

    callLogin(data.email, data.password);
  };

  const logout = async () => {
    // perform logout actions, remove stuff from locaStorage
    localStorage.removeItem('appToken');
    localStorage.removeItem('email');
    setIsLoggedIn(false);
    setEmail(null);

    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, email, login, logout, message }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;