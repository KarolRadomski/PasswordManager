const express = require('express');
const router = express.Router();
const { getAll, addUser, loginUser, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware.js');
const { admin } = require('../middleware/adminMiddleware.js');

router.get('/', protect, admin, getAll);
router.get('/me', protect, getMe);
router.post('/add', protect, admin, addUser);
router.post('/login', loginUser);

module.exports = router;
