async function loadDashboard(){
  try{
    const res = await fetch('/api/dashboard');
    const data = await res.json();

    document.getElementById('pending').textContent = data.quickStats.pending;
    document.getElementById('inProgress').textContent = data.quickStats.inProgress;
    document.getElementById('highRisk').textContent = data.quickStats.highRisk;
    document.getElementById('ready').textContent = data.quickStats.ready;

    const recent = document.getElementById('recentReviews');
    recent.innerHTML = '';
    data.recentReviews.forEach(r=>{
      const li = document.createElement('li');
      li.textContent = `${r.project} — ${r.status} (Reviewer: ${r.reviewer})`;
      recent.appendChild(li);
    });

    // Populate Risk Summary (total score, level, and release recommendation)
    document.getElementById('totalRisk').textContent = data.overallRisk;
    const levelEl = document.getElementById('overallLevel');
    let levelText = 'LOW';
    if (data.overallRisk >= 75) levelText = 'HIGH';
    else if (data.overallRisk >= 50) levelText = 'MEDIUM';
    levelEl.textContent = levelText;
    levelEl.className = 'level ' + (levelText === 'HIGH' ? 'high' : levelText === 'MEDIUM' ? 'medium' : 'low');

    const releaseBtn = document.getElementById('releaseRec');
    if (data.overallRisk >= 60) {
      releaseBtn.textContent = 'NOT READY';
      releaseBtn.className = 'btn reject';
    } else {
      releaseBtn.textContent = 'READY';
      releaseBtn.className = 'btn approve';
    }

    // Populate Project Review checklist values
    document.getElementById('pr-arch').textContent = data.riskScores.architecture;
    document.getElementById('pr-sec').textContent = data.riskScores.security;
    document.getElementById('pr-perf').textContent = data.riskScores.performance;
    document.getElementById('pr-cq').textContent = data.riskScores.codeQuality;
    document.getElementById('pr-rr').textContent = data.riskScores.releaseReadiness;

    // Set small status labels (simple thresholds)
    function statusLabel(v){ if(v>=75) return 'High'; if(v>=50) return 'Medium'; if(v>=30) return 'Low'; return 'Ready'; }
    document.getElementById('pr-arch-status').textContent = statusLabel(data.riskScores.architecture);
    document.getElementById('pr-sec-status').textContent = statusLabel(data.riskScores.security);
    document.getElementById('pr-perf-status').textContent = statusLabel(data.riskScores.performance);
    document.getElementById('pr-cq-status').textContent = statusLabel(data.riskScores.codeQuality);
    document.getElementById('pr-rr-status').textContent = statusLabel(data.riskScores.releaseReadiness);

    // Update gauge using conic-gradient: convert percent to degrees (0-100 => 0-360)
    const deg = Math.round((data.overallRisk / 100) * 180); // semicircle 0..180
    const gauge = document.getElementById('overallGauge');
    gauge.style.background = `conic-gradient(#e74c3c 0deg, #e74c3c ${deg}deg, #ddd ${deg}deg)`;
    document.getElementById('gaugeValue').textContent = data.overallRisk;
    document.getElementById('overallBtn').textContent = data.overallRisk >= 60 ? 'Overall Risk High' : 'Overall Risk OK';

    const findings = document.getElementById('findings');
    findings.innerHTML = '';
    data.report.keyFindings.forEach(f=>{
      const li = document.createElement('li'); li.textContent = f; findings.appendChild(li);
    });

    const recs = document.getElementById('recs');
    recs.innerHTML = '';
    data.report.recommendations.forEach(r=>{ const li = document.createElement('li'); li.textContent = r; recs.appendChild(li); });

  }catch(err){ console.error('Failed to load dashboard', err); }
}

loadDashboard();

// Show signed-in user (demo)
const signedEl = document.getElementById('signedInAs');
if (signedEl) signedEl.textContent = 'Signed in as Ananta.bulusu@winwire.com';

document.getElementById('downloadReport').addEventListener('click', ()=>{
  alert('Download feature not implemented in this demo.');
});
