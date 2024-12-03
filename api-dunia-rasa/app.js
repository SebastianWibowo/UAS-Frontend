const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const commentRoutes = require('./routes/commentRoutes');
const app = express();
const port = 3000;
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/comments', commentRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));