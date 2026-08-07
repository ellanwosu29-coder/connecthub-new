import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import axios from 'axios';
import '../styles/Login.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!agree) {
            setError('Please agree to the Terms of Service');
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/api/auth/register`, {
                name,
                email,
                password
            });
            setSuccess('Account created! Please login.');
            setError('');
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setAgree(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            setSuccess('');
        }
    };

    return (
        <div className="login-page">

            {/* ========= LEFT PANEL ========= */}
            <section className="login-left">
                <div className="left-content">
                    <div className="brand">
                        <img
                            src="https://res.cloudinary.com/daaiil1ah/image/upload/v1784995479/free-whatsapp-logo-icon-4456-thumb_cvjd7y.png"
                            alt="ConnectHub Logo"
                        />
                        <div>
                            <h1>ConnectHub</h1>
                            <p>Real-time conversations.</p>
                        </div>
                    </div>

                    <div className="hero-text">
                        <h2>
                            Join the
                            <br />
                            Community.
                            <br />
                            <span style={{ color: '#d4f5e9' }}>Start Chatting.</span>
                        </h2>
                        <p>
                            Create your account and connect with friends, family,
                            and colleagues around the world. Simple, secure, and
                            always in sync.
                        </p>
                    </div>

                    <div className="chat-preview">
                        <div className="message received">
                            <span className="avatar">👋</span>
                            <div className="bubble">
                                <h5>Welcome</h5>
                                <p>Join ConnectHub today!</p>
                                <small>2 min ago</small>
                            </div>
                        </div>
                        <div className="message sent">
                            <div className="bubble">
                                <h5>You</h5>
                                <p>Creating my account now!</p>
                                <small>Just now</small>
                            </div>
                            <span className="avatar">🚀</span>
                        </div>
                    </div>

                    <div className="features">
                        <div className="feature-card">
                            <span>⚡</span>
                            <h4>Fast</h4>
                            <p>Instant messaging</p>
                        </div>
                        <div className="feature-card">
                            <span>🔒</span>
                            <h4>Secure</h4>
                            <p>Private conversations</p>
                        </div>
                        <div className="feature-card">
                            <span>🌍</span>
                            <h4>Anywhere</h4>
                            <p>Stay connected</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========= RIGHT PANEL ========= */}
            <section className="login-right">
                <div className="login-box">
                    <div className="mobile-logo">
                        <img
                            src="https://res.cloudinary.com/daaiil1ah/image/upload/v1784995479/free-whatsapp-logo-icon-4456-thumb_cvjd7y.png"
                            alt="logo"
                        />
                    </div>

                    <div className="welcome-back">
                        <h2>Create Account 🎉</h2>
                        <p>Join us and start connecting with people.</p>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="login-options">
                            <label className="remember">
                                <input
                                    type="checkbox"
                                    checked={agree}
                                    onChange={(e) => setAgree(e.target.checked)}
                                />
                                <span>I agree to Terms & Privacy</span>
                            </label>
                        </div>

                        {error && <p className="error-msg">{error}</p>}
                        {success && <p className="success-msg">{success}</p>}

                        <button className="btn-login" type="submit">
                            Create Account
                        </button>
                    </form>

                    <div className="divider">
                        <span></span>
                        <p>OR</p>
                        <span></span>
                    </div>

                    <button className="btn-google">
                        <img
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                            alt="google"
                        />
                        Sign up with Google
                    </button>

                    <div className="signup-text">
                        Already have an account? <a href="/login">Sign In</a>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Register;