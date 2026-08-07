import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // await axios.post('http://localhost:5000/api/auth/login', 
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, 
         {
        email,
        password,
      });

      console.log('✅ Login response:', response.data);

      const { token, user } = response.data;

      if (!token) {
        setError('Login failed: no token received');
        setLoading(false);
        return;
      }

      if (!user || !user._id) {
        setError(
          'Login failed: user data missing — make sure your backend login returns the user object'
        );
        setLoading(false);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('✅ Saved to localStorage:', { token, user });

      navigate('/loading');
    } catch (err) {
      console.error('❌ Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* LEFT SIDEBAR - Laptop Only */}
      <div className="sidebar">
        <div className="sidebar-content">
          <img
            src="https://res.cloudinary.com/daaiil1ah/image/upload/v1784995479/free-whatsapp-logo-icon-4456-thumb_cvjd7y.png"
            alt="ConnectHub Logo"
          />
          <h1>
            Connect. <br /> Chat. <br />
            <span> Stay Close.</span>
          </h1>
          <p>Simple, secure and reliable messaging for everyone, everywhere</p>
          <div className="phone-img">
            <img
              src="https://res.cloudinary.com/daaiil1ah/image/upload/v1785069358/OIP__1_-removebg-preview_md68ci.png"
              alt=""
            />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="login-container">
        <div className="login-box">
          <div className="welcome-back">
            <img
              className="mobile-logo"
              src="https://res.cloudinary.com/daaiil1ah/image/upload/v1784995479/free-whatsapp-logo-icon-4456-thumb_cvjd7y.png"
              alt="ConnectHub Logo"
            />
            <h1>Welcome back</h1>
            <p>Login to continue chatting with your friends</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="forgot-link">
              <a href="#">Forgot Password?</a>
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? '⏳ Logging in...' : 'Login'}
            </button>
          </form>

          <div className="divider">
            <hr /> OR <hr />
          </div>

          <button className="btn-google">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
            />
            Continue with Google
          </button>

          <div className="signup-text">
            Don't have an account? <a href="/register">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;


