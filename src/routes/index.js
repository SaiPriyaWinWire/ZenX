const express = require('express');
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');
const adminRoutes = require('./admin');
const tqaRoutes = require('./tqa');

const router = express.Router();

router.use(authRoutes);
router.use(dashboardRoutes);
router.use(adminRoutes);
router.use(tqaRoutes);

router.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/tqa/dashboard');
  }
  return res.redirect('/login');
});

router.get('/healthz', (req, res) => {
  res.type('text/plain').send('ok');
});

module.exports = router;
