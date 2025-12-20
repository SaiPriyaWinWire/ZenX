const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple API returning dashboard data used by the frontend
app.get('/api/dashboard', (req, res) => {
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

// Simple whoami endpoint for demo purposes. Reads `DEV_USER_EMAIL` env var.
app.get('/api/whoami', (req, res) => {
  const email = process.env.DEV_USER_EMAIL || 'Ananta.bulusu@winwire.com';
  res.json({ email });
});

// In-memory risk config for demo (would normally be persisted)
let riskConfig = {
  architecture_weight: 25,
  security_weight: 30,
  performance_weight: 20,
  code_quality_weight: 10,
  release_weight: 15,
  low_from: 0, low_to: 30, med_from: 31, med_to: 60, high_from: 61, high_to: 100
};

app.get('/api/admin/risk-config', (req, res) => {
  res.json(riskConfig);
});

app.post('/api/admin/risk-config', (req, res) => {
  const body = req.body || {};
  // Merge and coerce to numbers where appropriate
  Object.keys(riskConfig).forEach(k=>{ if (body[k] !== undefined) riskConfig[k] = isNaN(body[k]) ? body[k] : Number(body[k]) });
  res.json({ ok: true, config: riskConfig });
});

app.listen(port, () => {
  console.log(`ZenX app listening at http://localhost:${port}`);
});
