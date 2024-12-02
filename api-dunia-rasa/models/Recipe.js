const mongoose = require('mongoose');
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  photo: { type: String },
  description: { type: String },
  tags: [{ type: String }],
  prepTime: { type: Number },
  cookTime: { type: Number },
  serving: { type: Number },
  ingredients: [{ type: String }],
  tools: [{ type: String }],
  instructions: [{ type: String }],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', recipeSchema);