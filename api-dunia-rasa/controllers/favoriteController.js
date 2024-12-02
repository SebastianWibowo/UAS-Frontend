const User = require('../models/User');
const Recipe = require('../models/Recipe');

// Menambahkan resep ke dalam favorit
const addToFavorites = async (req, res) => {
  const userId = req.user.id;  // Mengambil user yang sudah login
  const { recipeId } = req.body;

  try {
    // Cari resep berdasarkan ID
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Cari pengguna berdasarkan ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });  // Menambahkan pengecekan user
    }

    // Periksa apakah resep sudah ada di favorit
    if (!user.favorites.includes(recipeId)) {
      user.favorites.push(recipeId);
      await user.save();
      return res.status(200).json({ message: 'Recipe added to favorites' });
    } else {
      return res.status(400).json({ message: 'Recipe is already in favorites' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkFavorites = async (req, res) => {
  const userId = req.user.id; // ID pengguna yang login
  const recipeId = req.params.recipeId; // ID resep dari parameter URL

  try {
    // Cari pengguna berdasarkan ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Periksa apakah ID resep ada di daftar favorit pengguna
    const isFavorite = user.favorites.includes(recipeId);

    res.status(200).json({ isFavorite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Menghapus resep dari favorit
const removeFromFavorites = async (req, res) => {
    const userId = req.user.id;
    const { recipeId } = req.body;

    try {
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const user = await User.findById(userId);
        const index = user.favorites.indexOf(recipeId);
        if (index === -1) {
            return res.status(404).json({ message: 'Recipe not found in favorites' });
        }

        user.favorites.splice(index, 1);  // Menghapus resep dari daftar favorit
        await user.save();
        
        res.status(200).json({ message: 'Recipe removed from favorites' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addToFavorites, removeFromFavorites, checkFavorites };