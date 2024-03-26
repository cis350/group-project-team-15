import React, { useState } from 'react';
import './Login.css';


function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

    fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email,
        "password": hashedPassword,
      }),
    }).then((response) => {
      console.log(response.json());
    }).catch(error => {
      console.error(error);
    });
  };


  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Register to SkillExchange</h2>
        <div>
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
      </form>
    </div>
  );
}

export default Register;
