// Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; // Use the shared CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="wrapper-login"> {/* Use unique class names */}
      <form className="form-login" onSubmit={handleSubmit}> {/* Use unique class names */}
        <div className="field-login"> {/* Use unique class names */}
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
          <label>Email Address</label>
        </div>
        <div className="field-login"> {/* Use unique class names */}
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
          <label>Password</label>
        </div>
        <div className="field-login"> {/* Use unique class names */}
          <input type="submit" value="Login" className="auth-btn-login" />
        </div>
        <p className="p-login"> {/* Use unique class names */}
          Not a member? <Link to="/register">Signup now</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
