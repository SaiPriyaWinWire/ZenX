const express = require('express');
const authController = require('../controllers/authController');
const { redirectIfAuthenticated, ensureAuthenticated } = require('../middleware/authMiddleware');
const config = require('../config');

const router = express.Router();

router.get('/login', redirectIfAuthenticated, authController.showLogin);
router.post('/login', redirectIfAuthenticated, authController.login);
router.get('/auth/azure/start', redirectIfAuthenticated, authController.startAzureLogin);
router.get('/auth/azure/callback', redirectIfAuthenticated, authController.handleAzureCallback);
router.post('/logout', ensureAuthenticated, authController.logout);

module.exports = router;
