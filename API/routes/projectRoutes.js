const express = require('express');
const router = express.Router();
const { getAllProjects, getUserProjects, addProject, removeProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware.js');
const { admin } = require('../middleware/adminMiddleware.js');

router.get('/', protect, admin, getAllProjects);
router.get('/user', protect, getUserProjects);
router.post('/', protect, admin, addProject);
router.delete('/', protect, admin, removeProject);

module.exports = router;
