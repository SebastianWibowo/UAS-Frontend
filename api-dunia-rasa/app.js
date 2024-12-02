const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const app = express();
const port = 3000;
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', userRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));