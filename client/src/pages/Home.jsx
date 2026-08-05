import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import socket from '../utils/socket';
import '../styles/Home.css';

function Home() {
    const [friends, setFriends] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('chats');
    const [discoverUsers, setDiscoverUsers] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [typingUser, setTypingUser] = useState(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchFriends = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/friends/list`, authHeaders);
            setFriends(res.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchDiscoverUsers = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/friends/discover`, authHeaders);
            setDiscoverUsers(res.data);
        } catch (error) {
            console.error('Error fetching discover users:', error);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/friends/pending`, authHeaders);
            setPendingRequests(res.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        if (tab === 'people') fetchDiscoverUsers();
        if (tab === 'requests') fetchPendingRequests();
    };

    const sendFriendRequest = async (receiverId) => {
        try {
            await axios.post(`${API_BASE_URL}/api/friends/request`, { receiverId }, authHeaders);
            setDiscoverUsers(prev => prev.filter(u => u._id !== receiverId));
            alert('Friend request sent!');
        } catch (error) {
            console.error('Error sending request:', error);
        }
    };

    const acceptRequest = async (requestId) => {
        try {
            await axios.put(`${API_BASE_URL}/api/friends/accept/${requestId}`, {}, authHeaders);
            setPendingRequests(prev => prev.filter(r => r._id !== requestId));
            fetchFriends();
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const rejectRequest = async (requestId) => {
        try {
            await axios.put(`${API_BASE_URL}/api/friends/reject/${requestId}`, {}, authHeaders);
            setPendingRequests(prev => prev.filter(r => r._id !== requestId));
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };

    const selectChat = async (friend) => {
        setSelectedChat(friend);
        setMessages([]);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/messages/${friend._id}`, authHeaders);
            setMessages(res.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = () => {
        if (!newMessage.trim() || !selectedChat) return;

        socket.emit('private-message', {
            receiverId: selectedChat._id,
            text: newMessage
        });

        setMessages(prev => [...prev, {
            senderId: user._id,
            text: newMessage,
            time: new Date().toLocaleTimeString(),
        }]);

        setFriends(prev =>
            prev.map(f =>
                f._id === selectedChat._id
                    ? { ...f, lastMessage: newMessage, time: 'Just now' }
                    : f
            )
        );

        setNewMessage('');
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        if (selectedChat) {
            socket.emit('typing', { receiverId: selectedChat._id, isTyping: true });
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('typing', { receiverId: selectedChat._id, isTyping: false });
            }, 1500);
        }
    };

    const handleLogout = () => {
        socket.disconnect();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    useEffect(() => {
        if (!token || !user._id) return;
        socket.auth = { token };
        socket.connect();

        socket.on('connect', () => console.log('✅ Socket connected'));
        socket.on('connect_error', (err) => console.error('❌ Socket error:', err.message));
        socket.on('online-users', (onlineUsers) => {
            setFriends(prev =>
                prev.map(f => ({
                    ...f,
                    online: onlineUsers.some(u => u.userId === f._id)
                }))
            );
        });
        socket.on('error-message', (err) => console.error('⚠️ Server error:', err.message));

        return () => {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('online-users');
            socket.off('error-message');
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const handleNewMessage = (message) => {
            if (selectedChat && message.sender === selectedChat._id) {
                setMessages(prev => [...prev, {
                    senderId: message.sender,
                    text: message.text,
                    time: new Date().toLocaleTimeString(),
                }]);
            }
            setFriends(prev =>
                prev.map(f =>
                    f._id === message.sender
                        ? { ...f, lastMessage: message.text, time: 'Just now' }
                        : f
                )
            );
        };

        const handleTypingEvent = ({ userId, isTyping }) => {
            if (selectedChat && userId === selectedChat._id) {
                setTypingUser(isTyping ? selectedChat.name : null);
            }
        };

        socket.on('new-message', handleNewMessage);
        socket.on('typing', handleTypingEvent);
        return () => {
            socket.off('new-message', handleNewMessage);
            socket.off('typing', handleTypingEvent);
        };
    }, [selectedChat]);

    const filteredFriends = friends.filter(f =>
        f.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="hm-loading">
                <div className="hm-spinner"></div>
            </div>
        );
    }

    return (
        <div className="hm-page">
            {/* SIDEBAR */}
            <div className="hm-sidebar">
                <div className="hm-sidebar-header">
                    <h2>Connecthub</h2>
                    <button className="hm-logout-btn" onClick={handleLogout}>🚪</button>
                </div>

                <div className="hm-search">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="hm-tabs">
                    <button
                        className={activeTab === 'chats' ? 'hm-tab active' : 'hm-tab'}
                        onClick={() => handleTabSwitch('chats')}
                    >
                        Chats
                    </button>
                    <button
                        className={activeTab === 'people' ? 'hm-tab active' : 'hm-tab'}
                        onClick={() => handleTabSwitch('people')}
                    >
                        People
                    </button>
                    <button
                        className={activeTab === 'requests' ? 'hm-tab active' : 'hm-tab'}
                        onClick={() => handleTabSwitch('requests')}
                    >
                        Requests
                        {pendingRequests.length > 0 && (
                            <span className="hm-badge">{pendingRequests.length}</span>
                        )}
                    </button>
                </div>

                <div className="hm-list">
                    {activeTab === 'chats' && (
                        <>
                            {filteredFriends.length === 0 ? (
                                <div className="hm-empty">
                                    <p>👥</p>
                                    <h3>No friends yet</h3>
                                    <p>Go to People tab to add friends</p>
                                </div>
                            ) : (
                                filteredFriends.map(friend => (
                                    <div
                                        key={friend._id}
                                        className={`hm-item ${selectedChat?._id === friend._id ? 'hm-item-active' : ''}`}
                                        onClick={() => selectChat(friend)}
                                    >
                                        <div className="hm-avatar">
                                            {friend.name?.charAt(0).toUpperCase()}
                                            {friend.online && <span className="hm-online-dot" />}
                                        </div>
                                        <div className="hm-item-info">
                                            <div className="hm-item-name">{friend.name}</div>
                                            <div className="hm-item-sub">{friend.lastMessage || 'Say hello! 👋'}</div>
                                        </div>
                                        <div className="hm-item-time">{friend.time || ''}</div>
                                    </div>
                                ))
                            )}
                        </>
                    )}

                    {activeTab === 'people' && (
                        <>
                            {discoverUsers.length === 0 ? (
                                <div className="hm-empty">
                                    <p>No new people to add!</p>
                                </div>
                            ) : (
                                discoverUsers.map(u => (
                                    <div key={u._id} className="hm-item">
                                        <div className="hm-avatar">
                                            {u.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="hm-item-info">
                                            <div className="hm-item-name">{u.name}</div>
                                            <div className="hm-item-sub">{u.email}</div>
                                        </div>
                                        <button
                                            className="hm-add-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                sendFriendRequest(u._id);
                                            }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                ))
                            )}
                        </>
                    )}

                    {activeTab === 'requests' && (
                        <>
                            {pendingRequests.length === 0 ? (
                                <div className="hm-empty">
                                    <p>No pending requests</p>
                                </div>
                            ) : (
                                pendingRequests.map(req => (
                                    <div key={req._id} className="hm-item">
                                        <div className="hm-avatar">
                                            {req.sender.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="hm-item-info">
                                            <div className="hm-item-name">{req.sender.name}</div>
                                            <div className="hm-item-sub">{req.sender.email}</div>
                                        </div>
                                        <div className="hm-req-actions">
                                            <button
                                                className="hm-accept-btn"
                                                onClick={() => acceptRequest(req._id)}
                                            >✓</button>
                                            <button
                                                className="hm-reject-btn"
                                                onClick={() => rejectRequest(req._id)}
                                            >✕</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* CHAT SCREEN */}
            <div className="hm-chat">
                {selectedChat ? (
                    <>
                        <div className="hm-chat-header">
                            <div className="hm-chat-header-info">
                                <div className="hm-avatar">
                                    {selectedChat.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="hm-chat-name">{selectedChat.name}</div>
                                    <div className="hm-chat-status">
                                        {typingUser ? '✍️ typing...' : selectedChat.online ? '🟢 Online' : '⚪ Offline'}
                                    </div>
                                </div>
                            </div>
                            <div className="hm-chat-actions">
                                <i className="bx bx-phone"></i>
                                <i className="bx bx-video"></i>
                            </div>
                        </div>

                        <div className="hm-messages">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`hm-msg ${msg.senderId === user._id ? 'hm-msg-sent' : 'hm-msg-received'}`}
                                >
                                    <div className="hm-msg-bubble">
                                        {msg.text}
                                        <span className="hm-msg-time">{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="hm-input-bar">
                            <i className="bx bx-smile"></i>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={handleTyping}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            <button className="hm-send-btn" onClick={sendMessage}>
                                <i className="bx bx-send"></i>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="hm-no-chat">
                        <div className="hm-no-chat-icon">💬</div>
                        <h2>Select a chat</h2>
                        <p>Choose a friend to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;