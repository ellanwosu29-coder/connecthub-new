import { io } from 'socket.io-client';

// const SOCKET_URL = 'http://localhost:5000';
import { API_BASE_URL } from '../config';

const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
});

export default socket;