const Recipe = require('../models/Recipe');
const User = require('../models/User');

// Menambahkan komentar pada resep
const addComment = async (req, res) => {
  const { recipeId, comment } = req.body;
  const userId = req.user.id;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const user = await User.findById(userId);
    let userName = 'Anonymous'; // Default name if user is not found
    if (user) {
      userName = user.name;
    }

    const newComment = {
      userId: { _id: userId, name: userName },  // Menyimpan objek userId lengkap
      comment: comment,
      timestamp: new Date().toISOString()  // Menyimpan timestamp komentar
    };

    // Menambahkan komentar ke resep
    recipe.comments.push({ userId, comment });
    await recipe.save();

    res.status(200).json({ message: 'Comment added: ' + comment, data: newComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    addComment,
};