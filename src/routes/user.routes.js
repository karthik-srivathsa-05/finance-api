const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

//PUT /api/user/theme
router.put('/theme', userController.updateTheme);

module.exports = router;