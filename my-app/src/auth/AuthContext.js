import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('appToken'));
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const login = (data) => {
    // TODO: login stuff lol!
    axios.post("http://localhost:8080/login", {
      email: data.email,
      password: data.password
    }).then((response) => {
      console.log(response);

      localStorage.setItem('appToken', response.data.apptoken);
      setIsLoggedIn(true);

      localStorage.setItem('email', data.email)
      setEmail(data.email)

      setMessage("");

      navigate(`/profile/${data.email}`);
    }).catch((error) => {
      console.error(error.response.data.error);
      setMessage(error.response.data.error);
    });
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