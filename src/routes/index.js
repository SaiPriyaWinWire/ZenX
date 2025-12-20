const express = require('express');
const path = require('path');
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');
const tqaRoutes = require('./tqa');

const router = express.Router();

router.use(authRoutes);
router.use(dashboardRoutes);
router.use(tqaRoutes);

// Demo login: accept sample Reviewer credentials and set session
router.post('/login-demo', (req, res) => {
  const { email, password, role } = req.body || {};
  const okEmail = (email || '').toLowerCase() === 'reviewer@example.com';
  const okPass = (password || '') === 'TqaDemo@2025';
  const isReviewer = (role || '').toLowerCase() === 'reviewer';
  if (okEmail && okPass && isReviewer) {
    req.session.user = { email, role: 'Reviewer' };
    return res.redirect('/reviewers');
  }
  req.flash('error', 'Invalid credentials for Reviewer demo');
  return res.redirect('/login');
});

// Demo reviewers route: serve demo static assets and API under /reviewers
router.get('/reviewers', (req, res) => {
  // Serve the demo index (public/demo/index.html)
  res.sendFile('demo/index.html', { root: path.resolve(__dirname, '../../public') });
});

router.get('/reviewers/api/dashboard', (req, res) => {
  // Return the same demo JSON payload used by the standalone demo server
  res.json({
    quickStats: { pending: 5, inProgress: 3, highRisk: 2, ready: 4 },
    recentReviews: [
      { project: 'Project Renet', status: 'Ready', reviewer: 'Detain Millet' },
      { project: 'Project Alpha', status: 'Reject', reviewer: 'Ennig Ailler' },
      { project: 'Project Beta', status: 'Ready', reviewer: 'E-'
      }
    ],
    riskScores: { architecture: 75, security: 60, performance: 45, codeQuality: 30, releaseReadiness: 80 },
    overallRisk: 64,
    report: {
      keyFindings: [
        'Reviewers reported multiple issues before approval',
        'Inconsistent security practices observed'
      ],
      recommendations: [
        'Improve CI checks before approval',
        'Address outstanding security issues'
      ]
    }
  });
});

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
