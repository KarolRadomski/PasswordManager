const express = require('express');
const router = express.Router();
const { getAll, addUser, loginUser, getMe, removeUser, countUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware.js');
const { admin } = require('../middleware/adminMiddleware.js');

router.get('/', protect, admin, getAll);
router.get('/count', protect, admin, countUsers);
router.get('/me', protect, getMe);
router.post('/add', protect, admin, addUser);
router.delete('/:id', protect, admin, removeUser);
// router.post('/add', addUser);
router.post('/login', loginUser);

module.exports = router;
