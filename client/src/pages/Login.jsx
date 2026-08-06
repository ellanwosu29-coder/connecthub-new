import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
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
            const response = await axios.post(`${API_BASE_URL}auth/login`, {
                email,
                password
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user || { name: 'User' }));

            setLoading(false);
            navigate('/loading');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="sidebar">
                <div className="sidebar-content">
                    <img 
                        src="https://res.cloudinary.com/daaiil1ah/image/upload/v1784995479/free-whatsapp-logo-icon-4456-thumb_cvjd7y.png" 
                        alt="ConnectHub Logo" 
                    />
                    <h1>Connect.<br />Chat.<br />Stay close.</h1>
                    <p>Simple, secure and reliable messaging for everyone, everywhere and anywhere</p>
                </div>
            </div>

            <div className="login-container">
                <div className="login-box">
                    <div className="welcome-back">
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

                        {error && <p className="error-msg">{error}</p>}

                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? '⏳ Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="signup-text">
                        Don't have an account? <a href="/register">Sign up</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;