import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import axios from 'axios';
import '../styles/Login.css'; // reuse styles

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
            await axios.post(`${API_BASE_URL}auth/register`,  {
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
        <div className="login-wrapper">
            {/* LEFT SIDEBAR */}
            <div className="sidebar">
                <div className="sidebar-content">
                    <img 
                        src="https://res.cloudinary.com/daaiil1ah/image/upload/v1784995479/free-whatsapp-logo-icon-4456-thumb_cvjd7y.png" 
                        alt="ConnectHub Logo" 
                    />
                    <h1>Connect. <br />Chat. <br /> <span>Stay Close.</span></h1>
                    <p>
                        Create an account and start connecting with people around you.
                    </p>
                    <div className='phone-img'>
                        <img src="https://res.cloudinary.com/daaiil1ah/image/upload/v1785069366/OIP-removebg-preview_fj97tt.png" alt="" />
                    </div>
                </div>

            </div>

            {/* RIGHT SIDE - Register Form */}
            <div className="login-container">
                <div className="login-box">
                    <div className="welcome-back">
                        <h1>Create your account</h1>
                        <p>Join us and start chatting with your friends and family. Stay close.</p>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <input 
                                type="email" 
                                placeholder="Email address" 
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
                            <input 
                                type="password" 
                                placeholder="Confirm password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Terms Checkbox */}
                        <div className="terms-checkbox">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                checked={agree}
                                onChange={(e) => setAgree(e.target.checked)}
                            />
                            <label htmlFor="terms">
                                I agree to the Terms of Service and Privacy Policy
                            </label>
                        </div>

                        {error && <p className="error-msg">{error}</p>}
                        {success && <p className="success-msg">{success}</p>}

                        <button type="submit" className="btn-login">Register</button>
                    </form>

                    {/* Divider */}
                    <div className="divider">
                        <hr /> or <hr />
                    </div>

                    {/* Google Button */}
                    <button className="btn-google">
                        <img 
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" 
                            alt="Google" 
                        />
                        Sign up with Google
                    </button>

                    {/* Login Link */}
                    <div className="signup-text">
                        Already have an account? <a href="/login">Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;