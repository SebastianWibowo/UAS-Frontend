const express = require('express');
const { addComment } = require('../controllers/commentController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/add', authenticateUser, addComment);

module.exports = router;