const express = require('express');
const { registerUser , loginUser , profilUser , deleteUser  } = require('../controllers/userController');
const { authenticateUser  } = require('../middlewares/authMiddleware');
const router = express.Router();

// Register user
router.post('/register', registerUser );

// Login user
router.post('/login', loginUser );

// Profil user
router.get('/profile', authenticateUser , profilUser );

// Delete user
router.delete('/delete', authenticateUser , deleteUser );

module.exports = router;