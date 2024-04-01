import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add logic to handle login here
    console.log('Register account', email, password);

    // const goodEmail = /^\w+@(?:\w{2,}.)+[a-z]{2,}$/.test(email);
    // const tooShort = password.length < 8;
    // const hasUpperCase = /[A-Z]/.test(password);
    // const hasLowerCase = /[a-z]/.test(password);
    // const hasNumbers = /\d/.test(password);
    // const hasNonalphas = /\W/.test(password);
    // if (!goodEmail || tooShort || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasNonalphas) {
    //   alert("Weak password OR bad email");
    // }
    //const hashedPassword = require('bcrypt').hashSync(password, 10);
    const hashedPassword = password;

    axios.post('http://localhost:8080/register', {
      email: email,
      password: hashedPassword
    }).then((response) => {
      console.log(response);
      sessionStorage.setItem('appToken', response.token);
      navigate(`/profile/${email}`);
    }).catch(error => {
      console.error(error);
      setError(true);
      setErrorMessage(`Error: ${error.response.data.error}`);
    });
  };


  return (
    <div className="">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="mt-3">
          <input
            type="text"
            name="email"
            placeholder="Email"
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
          <button type="submit">Register</button>
        </div>
        {error && <div className="text-red-500">{errorMessage}</div>}
      </form>
    </div>
  );
}

export default Register;
