const express = require('express');
const { registerUser , loginUser , profilUser , deleteUser , updateUser} = require('../controllers/userController');
const { authenticateUser  } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route untuk mengupdate nama pengguna
router.put('/update-name', authenticateUser , updateUser);

// Route lainnya...
router.post('/register', registerUser );
router.post('/login', loginUser );
router.get('/profile', authenticateUser , profilUser );
router.delete('/delete', authenticateUser , deleteUser );

module.exports = router;