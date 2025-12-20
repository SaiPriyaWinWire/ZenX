const express = require('express');

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

router.get('/tqa/dashboard', withSidebar, (req, res) => {
  res.locals.pageTitle = 'Dashboard';
  res.render('tqa/dashboard', { layout: 'layouts/main' });
});

router.get('/tqa/reviews', withSidebar, (req, res) => {
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

router.get('/tqa/risk', withSidebar, (req, res) => {
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

router.get('/tqa/approvals', withSidebar, (req, res) => {
  res.locals.pageTitle = 'Approval & Decision';
  res.render('tqa/approvals', { layout: 'layouts/main' });
});

router.get('/tqa/reports', withSidebar, (req, res) => {
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

router.get('/tqa/audit', withSidebar, (req, res) => {
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
