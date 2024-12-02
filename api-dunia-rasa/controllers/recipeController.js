const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');

// Add Recipe
exports.addRecipe = async (req, res) => {
  try {
    const { title, photo, description, tags, prepTime, cookTime, serving, ingredients, tools, instructions } = req.body;

    const recipe = new Recipe({
      title,
      photo,
      description,
      tags,
      prepTime,
      cookTime,
      serving,
      ingredients,
      tools,
      instructions,
      createdBy: req.user.id
    });

    await recipe.save();
    res.status(201).json({ message: 'Recipe added successfully', recipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search resep berdasarkan nama
exports.getRecipeByName = async (req, res) => {
  const { name } = req.query;  // Mendapatkan nama resep dari query parameter
  
  if (!name) {
    return res.status(400).json({ message: 'Recipe name query parameter is required' });
  }

  try {
    // Pencarian resep berdasarkan nama (case-insensitive search)
    const recipes = await Recipe.find({
      title: { $regex: name, $options: 'i' }  // 'i' untuk case-insensitive
    });

    if (recipes.length === 0) {
      return res.status(200).json({ message: 'No recipes found', data: [] });
    }

    // Mengembalikan hasil pencarian
    res.status(200).json({ message: 'Recipes found', data: recipes });
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mendapatkan semua resep
exports.getAllRecipes = async (req, res) => {
  try {
    const { tag } = req.query; // Mendapatkan query parameter 'tag' jika ada
    let recipes;

    if (tag) {
      // Jika ada query tag, filter berdasarkan tag tersebut
      recipes = await Recipe.find({ tags: tag }).populate('createdBy', 'name');
    } else {
      // Jika tidak ada filter, ambil semua resep
      recipes = await Recipe.find().populate('createdBy', 'name');
    }

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan resep berdasarkan ID
exports.getRecipeById = async (req, res) => {
  const { id } = req.params;

  // Validasi ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid recipe ID format' });
  }

  try {
    const recipe = await Recipe.findById(id).populate('createdBy', 'name').populate('comments.userId', 'name');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const formattedRecipe = {
      ...recipe.toObject(),
      instructions: recipe.instructions.map((desc, index) => ({
        step: index + 1,
        description: desc,
      })),
      tags: recipe.tags.map(tag => ({
        name: tag,
        link: `tag-${tag.toLowerCase().replace(/\s+/g, '-')}.html`,
      })),
    };

    res.status(200).json(formattedRecipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Recipes by Tag
exports.filterRecipesByTags = async (req, res) => {
  const { tags } = req.query;
  
  // Validasi jika tags tidak diberikan
  if (!tags) {
    return res.status(400).json({ error: 'Tags parameter is required' });
  }

  try {
    const recipes = await Recipe.find({ tags: { $in: tags.split(',') } });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all unique tags
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Recipe.aggregate([
      { $unwind: "$tags" },          // Membongkar array tags menjadi dokumen individual
      { $group: {                   // Mengelompokkan berdasarkan tags dan menghitung jumlahnya
          _id: "$tags",
          count: { $sum: 1 }        // Menambahkan hitungan setiap elemen
      } },
      { $sort: { _id: 1 } }          // Mengurutkan tags secara alfabet
    ]);

    res.status(200).json(
      tags.map(tag => ({
        tag: tag._id,   // Nama tag
        count: tag.count // Jumlah resep dengan tag tersebut
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};