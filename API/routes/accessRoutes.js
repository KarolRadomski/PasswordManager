const express = require('express');
const router = express.Router();
const { grantAccessToExistingUser, grantAccessToNewUser, getEntryAccesses } = require('../controllers/accessController');
const { protect } = require('../middleware/authMiddleware.js');
const { admin } = require('../middleware/adminMiddleware.js');

router.post('/:id', protect, admin, grantAccessToExistingUser);
router.post('/', protect, admin, grantAccessToNewUser);
router.get('/:id', protect, admin, getEntryAccesses);

module.exports = router;
