const express = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

router.get('/dashboard', ensureAuthenticated, dashboardController.dashboard);

module.exports = router;
