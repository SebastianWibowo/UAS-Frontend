const express = require('express');
const { addToFavorites, removeFromFavorites, checkFavorites } = require('../controllers/favoriteController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const router = express.Router();

// Menambahkan resep ke dalam favorit
router.post('/add', authenticateUser, addToFavorites);

// Menghapus resep dari favorit
router.post('/remove', authenticateUser, removeFromFavorites);

// Cek resep dari favorit
router.get('/check/:recipeId', authenticateUser, checkFavorites);

module.exports = router;