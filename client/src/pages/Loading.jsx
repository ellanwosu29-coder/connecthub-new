import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Loading.css';

function Loading() {
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    // Navigate to home after 100%
                    setTimeout(() => navigate('/home'), 500);
                    return 100;
                }
                // Increase progress by random amount (2-7%)
                const increment = Math.floor(Math.random() * 5) + 2;
                return Math.min(prev + increment, 100);
            });
        }, 300);

        return () => clearInterval(interval);
    }, [navigate]);

    return (
    <div className="loading-screen">

        {/* Background Effects */}
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>

        <div className="loading-card">

            {/* Brand */}

            <div className="brand">

                <img
                    src="https://res.cloudinary.com/daaiil1ah/image/upload/v1784995479/free-whatsapp-logo-icon-4456-thumb_cvjd7y.png"
                    alt="ConnectHub"
                    className="loading-logo"
                />

                <div className="brand-text">

                    <h1>ConnectHub</h1>

                    <p>
                        Real conversations. Anytime. Anywhere.
                    </p>

                </div>

            </div>

            {/* Hero */}

            <div className="hero">

                <h2>
                    Preparing your workspace...
                </h2>

                <p>
                    Securely syncing your chats and getting everything ready.
                </p>

            </div>

            {/* Chat Preview */}

            <div className="chat-preview">

                <div className="chat-row left">

                    <div className="avatar">

                        <img
                            src="https://i.pravatar.cc/100?img=32"
                            alt="Sarah"
                        />

                    </div>

                    <div className="bubble">

                        <span>Hello 👋</span>

                    </div>

                </div>

                <div className="chat-row right">

                    <div className="bubble sent">

                        <span>Hey! I'm here 😊</span>

                    </div>

                    <div className="avatar">

                        <img
                            src="https://i.pravatar.cc/100?img=15"
                            alt="You"
                        />

                    </div>

                </div>

            </div>

            {/* Progress Section */}

            <div className="progress-section">

                <div className="progress-info">

                    <span>
                        {progress < 25 && "Connecting..."}
                        {progress >= 25 &&
                            progress < 50 &&
                            "Loading Messages..."}
                        {progress >= 50 &&
                            progress < 75 &&
                            "Syncing Friends..."}
                        {progress >= 75 &&
                            progress < 100 &&
                            "Almost Ready..."}
                        {progress === 100 &&
                            "Welcome Back!"}
                    </span>

                    <strong>{progress}%</strong>

                </div>

                <div className="progress-container">

                    <div
                        className="progress-bar"
                        style={{
                            width: `${progress}%`,
                        }}
                    ></div>

                </div>

            </div>
                        {/* Animated Loading Dots */}

            <div className="loading-status">

                <div className="typing-loader">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

                <p className="status-text">
                    Please wait while we prepare your experience...
                </p>

            </div>

            {/* Features */}

            <div className="loading-features">

                <div className="feature">
                    ⚡ Fast
                </div>

                <div className="feature">
                    🔒 Secure
                </div>

                <div className="feature">
                    💬 Real-time
                </div>

            </div>

            {/* Footer */}

            <div className="loading-footer">

                <p>
                    Powered by <span>ConnectHub</span>
                </p>

            </div>

        </div>

    </div>
);
}

export default Loading;