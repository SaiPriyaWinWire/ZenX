const express = require('express');
const authController = require('../controllers/authController');
const { redirectIfAuthenticated, ensureAuthenticated } = require('../middleware/authMiddleware');
const config = require('../config');

const router = express.Router();

router.get('/login', redirectIfAuthenticated, authController.showLogin);
router.post('/login', redirectIfAuthenticated, authController.login);

// Azure AD redirect handler view
router.get('/auth/redirect', authController.azureRedirectView);
// Azure AD session establishment
router.post('/auth/session', authController.azureSession);

router.post('/logout', ensureAuthenticated, authController.logout);

module.exports = router;
