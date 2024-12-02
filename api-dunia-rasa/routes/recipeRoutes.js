const express = require('express');
const { addRecipe, filterRecipesByTags, getAllRecipes, getRecipeById, getAllTags, getRecipeByName } = require('../controllers/recipeController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const router = express.Router();

// Endpoint untuk mendapatkan semua resep
router.get('/', getAllRecipes);

// Endpoint untuk mendapatkan resep berdasarkan ID
router.get('/find/:id', getRecipeById);

router.get('/search', getRecipeByName);

// Add recipe
router.post('/add', authenticateUser, addRecipe);

// Filter recipes based on tags
router.get('/filter', filterRecipesByTags);

// Endpoint untuk mendapatkan semua tags yang digunakan di resep
router.get('/tags', getAllTags);

module.exports = router;