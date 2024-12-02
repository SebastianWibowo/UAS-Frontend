const express = require('express');
const { registerUser, loginUser, profilUser } = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const router = express.Router();

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Profil user
router.get('/profile', authenticateUser, profilUser);

module.exports = router;