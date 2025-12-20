const express = require('express');
const authController = require('../controllers/authController');
const { redirectIfAuthenticated, ensureAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/login', redirectIfAuthenticated, authController.showLogin);
router.post('/login', redirectIfAuthenticated, authController.login);

router.post('/logout', ensureAuthenticated, authController.logout);

module.exports = router;
