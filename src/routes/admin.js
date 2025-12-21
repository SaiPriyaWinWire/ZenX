const express = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

const sidebar = [
  { text: 'Risk Configuration', href: '/admin/risk-config' },
  { text: 'Team Dashboard', href: '/dashboard' }
];

const withSidebar = (req, res, next) => {
  res.locals.sidebar = sidebar;
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }

  req.flash('error', 'You do not have access to the requested admin page.');
  return res.redirect('/dashboard');
};

router.get('/admin/risk-config', ensureAuthenticated, requireAdmin, withSidebar, (req, res) => {
  res.locals.pageTitle = 'Risk Configuration';

  const weights = {
    architecture: 25,
    security: 30,
    performance: 20,
    releaseReadiness: 15,
    codeQuality: 10
  };

  const ranges = {
    low: { min: 0, max: 30 },
    medium: { min: 31, max: 60 },
    high: { min: 61, max: 100 }
  };

  const percentageOptions = Array.from({ length: 101 }, (_, index) => index);

  res.render('admin/riskConfig', {
    layout: 'layouts/main',
    weights,
    ranges,
    percentageOptions
  });
});

module.exports = router;
