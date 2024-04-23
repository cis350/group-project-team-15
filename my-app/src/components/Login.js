import React, { useState } from "react";
import "./Login.css";
import Register from "./Register";
import logo from './logo.png';

import { useAuth } from "../auth/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerPopUp, setRegisterPopUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const auth = useAuth();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Logging in with", email, password);

    const res = auth.login({ email: email, password: password });
    setErrorMessage(res);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Login to SkillExchange</h2>
        <div>
          <input
            type="text"
            name="email"
            placeholder="email"
            value={email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button type="submit">Sign in</button>
        </div>
        <div className="text-red-500">{errorMessage}</div>
        <div className="account-creation">
          <span>Don't have an account?</span>
          <button
            type="button"
            onClick={() => {
              setRegisterPopUp(!registerPopUp);
            }}
          >
            Create an account!
          </button>
        </div>
      </form>
      {registerPopUp && <Register />}
    </div>
  );
}

export default Login;
