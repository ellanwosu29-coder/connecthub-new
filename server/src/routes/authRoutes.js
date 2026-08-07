const express = require('express');
const { registerUser, loginUser, getUserProfile, getUsers, updateProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/profile", authMiddleware, getUserProfile);
router.get('/users', authMiddleware, getUsers);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;