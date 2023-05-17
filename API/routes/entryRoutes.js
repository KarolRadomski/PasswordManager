const express = require('express');
const router = express.Router();
const { getAllProjectEntry, getUserEntry, addNewProjectEntry, editProjectEntry, removeProjectEntry } = require('../controllers/entryController');
const { protect } = require('../middleware/authMiddleware.js');
const { admin } = require('../middleware/adminMiddleware.js');

router.get('/user/:id', protect, getUserEntry);
router.get('/', protect, admin, getAllProjectEntry);
router.post('/', protect, admin, addNewProjectEntry);
router.put('/:id', protect, admin, editProjectEntry);
router.delete('/:id', protect, admin, removeProjectEntry);

module.exports = router;
