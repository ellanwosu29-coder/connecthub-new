const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Login route (temporary test)
app.post('/api/auth/login', (req, res) => {
    res.json({ 
        success: true,
        message: 'Login endpoint is working!',
        received: req.body 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});