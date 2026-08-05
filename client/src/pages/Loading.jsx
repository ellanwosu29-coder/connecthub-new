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
            <div className="loading-content">
                {/* ===== LOGO ===== */}
                <img 
                    src="https://res.cloudinary.com/daaiil1ah/image/upload/v1784995479/free-whatsapp-logo-icon-4456-thumb_cvjd7y.png" 
                    alt="ConnectHub" 
                    className="loading-logo"
                />
                
                {/* ===== LOADING TEXT ===== */}
                <h2 className="loading-title">Loading your chats...</h2>
                
                {/* ===== PROGRESS BAR ===== */}
                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
                
                {/* ===== PROGRESS PERCENTAGE ===== */}
                <p className="progress-text">{progress}%</p>
                
                {/* ===== TIPS ===== */}
                <p className="loading-tip">
                    {progress < 30 && '🔄 Connecting to server...'}
                    {progress >= 30 && progress < 60 && '📥 Loading your chats...'}
                    {progress >= 60 && progress < 90 && '📊 Almost there...'}
                    {progress >= 90 && '🚀 Ready to chat!'}
                </p>
            </div>
        </div>
    );
}

export default Loading;