const express = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

const sidebar = [
  { text: 'Dashboard', href: '/tqa/dashboard', icon: '🏠' },
  { text: 'Review Requests', href: '/tqa/reviews', icon: '📥' },
  { text: 'Risk Analysis', href: '/tqa/risk', icon: '⚠️' },
  { text: 'Reports', href: '/tqa/reports', icon: '📊' },
  { text: 'Audit Logs', href: '/tqa/audit', icon: '🗒️' }
];

const withSidebar = (req, res, next) => {
  res.locals.sidebar = sidebar;
  next();
};

router.get('/tqa/dashboard', ensureAuthenticated, withSidebar, (req, res) => {
  res.locals.pageTitle = 'Reviewer Dashboard';

  const stats = [
    { label: 'Pending', value: 5 },
    { label: 'In Progress', value: 3 },
    { label: 'High Risk', value: 2, tone: 'warning' },
    { label: 'Ready', value: 4, tone: 'success' }
  ];

  const reviews = [
    { project: 'Project Renet', status: 'Ready', reviewer: 'Detain Millet' },
    { project: 'Project Alpha', status: 'Reject', reviewer: 'Enig Ailler' },
    { project: 'Project Beta', status: 'Ready', reviewer: 'E. Rivera' }
  ];

  const checklist = [
    { name: 'Architecture', score: 75, level: 'High' },
    { name: 'Security', score: 60, level: 'Medium' },
    { name: 'Performance', score: 45, level: 'Low' },
    { name: 'Code Quality', score: 30, level: 'Low' },
    { name: 'Release Readiness', score: 80, level: 'High' }
  ];

  const risk = {
    totalScore: 64,
    overallLevel: 'Medium',
    recommendation: 'Not Ready'
  };

  const latestReport = {
    riskSummary: 'High Risk',
    findings: [
      'Reviewers reported multiple issues before approval',
      'Inconsistent security practices observed'
    ],
    recommendations: [
      'Improve CI checks before approval',
      'Address outstanding security issues'
    ]
  };

  const auditLogs = [
    { timestamp: '21.01.2020 16:07', user: 'Admin', action: 'Checklist Generated', details: '-' },
    { timestamp: '21.01.2020 16:07', user: 'Admin', action: 'Risk Analysis Completed', details: '-' },
    { timestamp: '21.01.2020 16:07', user: 'Reviewer', action: 'Decision Approved', details: '-' }
  ];

  res.render('tqa/dashboard', {
    layout: 'layouts/main',
    stats,
    reviews,
    checklist,
    risk,
    latestReport,
    auditLogs,
    lastLoginAt: req.session.lastLoginAt || null
  });
});

router.get('/tqa/reviews', ensureAuthenticated, withSidebar, (req, res) => {
  res.locals.pageTitle = 'Project Alpha Review';
  const checklist = [
    { label: 'Architecture', score: 75, level: 'High' },
    { label: 'Security', score: 60, level: 'Medium' },
    { label: 'Performance', score: 45, level: 'Medium' },
    { label: 'Code Quality', score: 30, level: 'Low' },
    { label: 'Release Readiness', score: 80, level: 'Ready' }
  ];
  res.render('tqa/reviews', { layout: 'layouts/main', checklist });
});

router.get('/tqa/risk', ensureAuthenticated, withSidebar, (req, res) => {
  res.locals.pageTitle = 'AI Risk Assessment';
  const scores = [
    { label: 'Architecture', score: 75, level: 'High' },
    { label: 'Security', score: 60, level: 'Medium' },
    { label: 'Performance', score: 45, level: 'Below' },
    { label: 'Code Quality', score: 30, level: 'Low' },
    { label: 'Release Readiness', score: 80, level: 'Ready' }
  ];
  res.render('tqa/risk', { layout: 'layouts/main', scores, total: 64, summary: 'HIGH', recommendation: 'NOT READY' });
});

router.get('/tqa/approvals', ensureAuthenticated, withSidebar, (req, res) => {
  res.locals.pageTitle = 'Approval & Decision';
  res.render('tqa/approvals', { layout: 'layouts/main' });
});

router.get('/tqa/reports', ensureAuthenticated, withSidebar, (req, res) => {
  res.locals.pageTitle = 'Final Review Report';
  const findings = [
    'Resolves major issues before approval',
    'Because whitespace phrases'
  ];
  const recommendations = [
    'Improve simulative to the latest approved',
    'Address security issues prior to approval'
  ];
  res.render('tqa/reports', { layout: 'layouts/main', findings, recommendations, risk: 'High Risk' });
});

router.get('/tqa/audit', ensureAuthenticated, withSidebar, (req, res) => {
  res.locals.pageTitle = 'Audit & Activity Logs';
  const logs = [
    { ts: '21 Jan 2020 16:07', user: 'Admin', action: 'Checklist Generated', details: '' },
    { ts: '21 Jan 2020 16:05', user: 'Admin', action: 'Risk Analysis Completed', details: '' },
    { ts: '21 Jan 2020 16:07', user: 'Admin', action: 'Risk Analysis Completed', details: '' },
    { ts: '21 Jan 2020 16:07', user: 'Reviewer2', action: 'Decision Approved', details: '' },
  ];
  res.render('tqa/audit', { layout: 'layouts/main', logs });
});

module.exports = router;
