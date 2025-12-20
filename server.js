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

app.listen(port, () => {
  console.log(`ZenX app listening at http://localhost:${port}`);
});
