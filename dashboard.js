/* ═══════════════════════════════════════════════
   MARKETMIND AI — dashboard.js v2
═══════════════════════════════════════════════ */

/* ── CLOCK ── */
function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString('en-US', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

/* ── ANIMATED BACKGROUND CANVAS ── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function rand(a, b) { return a + Math.random() * (b - a); }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = rand(0, W);
      this.y    = rand(0, H);
      this.r    = rand(0.5, 2);
      this.vx   = rand(-0.15, 0.15);
      this.vy   = rand(-0.3, -0.05);
      this.life = 1;
      this.decay= rand(0.002, 0.006);
      this.hue  = [210, 240, 180][Math.floor(Math.random() * 3)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      if (this.life <= 0 || this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.life * 0.5})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  // Nebula blobs
  const blobs = [
    { x: 0.15, y: 0.35, r: 380, color: 'rgba(30,60,140,0.18)' },
    { x: 0.82, y: 0.2,  r: 320, color: 'rgba(60,30,120,0.14)' },
    { x: 0.5,  y: 0.75, r: 280, color: 'rgba(20,80,100,0.12)' },
  ];

  function drawBlobs() {
    blobs.forEach(b => {
      const grd = ctx.createRadialGradient(b.x * W, b.y * H, 0, b.x * W, b.y * H, b.r);
      grd.addColorStop(0, b.color);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    });
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(79,156,249,0.03)';
    ctx.lineWidth = 1;
    const step = 60;
    for (let x = 0; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);

    // Deep background
    ctx.fillStyle = '#05080f';
    ctx.fillRect(0, 0, W, H);

    drawBlobs();
    drawGrid();

    particles.forEach(p => { p.update(); p.draw(); });

    requestAnimationFrame(frame);
  }
  frame();
})();

/* ── SIDEBAR NAV ── */
function navClick(el, id) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── API ── */
const API = 'http://127.0.0.1:8000';
let trendChart, sentimentChart, salesChart;

/* Chart.js global defaults */
Chart.defaults.font.family = "'DM Sans', sans-serif";
Chart.defaults.color       = 'rgba(200,218,255,0.5)';
Chart.defaults.borderColor = 'rgba(99,179,237,0.08)';

/* ── HELPERS ── */
function setLoading(btnId, on) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.classList.toggle('loading', on);
  btn.disabled = on;
}

function setOutput(id, content, isHTML = false) {
  const el = document.getElementById(id);
  if (!el) return;
  if (isHTML) el.innerHTML = content;
  else        el.textContent = content;
  el.classList.toggle('filled', !!content);
}

function clearOutput(id) { setOutput(id, ''); }

const chartDefaults = {
  plugins: {
    legend: { labels: { color: 'rgba(200,218,255,0.55)', padding: 16, font: { size: 12 } } },
    tooltip: {
      backgroundColor: 'rgba(9,13,24,0.95)',
      borderColor: 'rgba(79,156,249,0.25)', borderWidth: 1,
      titleColor: '#e8f0fe', bodyColor: 'rgba(200,218,255,0.7)',
      padding: 10, cornerRadius: 8
    }
  },
  scales: {
    x: {
      ticks: { color: 'rgba(200,218,255,0.4)', font: { size: 11 } },
      grid:  { color: 'rgba(79,156,249,0.06)' }
    },
    y: {
      ticks: { color: 'rgba(200,218,255,0.4)', font: { size: 11 } },
      grid:  { color: 'rgba(79,156,249,0.06)' }
    }
  }
};

/* ═══ AI MARKETING STRATEGY ═══ */
async function generateStrategy() {
  const product  = document.getElementById('strategyProduct').value.trim();
  const audience = document.getElementById('strategyAudience').value.trim();
  if (!product || !audience) {
    setOutput('strategyResult', '⚠ Please fill in both fields.');
    return;
  }
  setLoading('strategyBtn', true);
  try {
    const r = await fetch(`${API}/strategy?product=${encodeURIComponent(product)}&audience=${encodeURIComponent(audience)}`);
    const d = await r.json();
    // Render line by line with spacing
    const html = d.strategy
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => `<p style="margin:0 0 10px">${line}</p>`)
      .join('');
    setOutput('strategyResult', html || '⚠ No output returned.', true);
  } catch {
    setOutput('strategyResult', '⚠ Could not reach API server. Make sure it\'s running on localhost:8000.');
  }
  setLoading('strategyBtn', false);
}

/* ═══ AI IDEA GENERATOR ═══ */
async function generateIdeas() {
  const product = document.getElementById('ideaProduct').value.trim();
  if (!product) return;
  setLoading('ideasBtn', true);
  try {
    const r = await fetch(`${API}/ideas?product=${encodeURIComponent(product)}`);
    const d = await r.json();
    // Render line by line with spacing
    const html = d.ideas
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => `<p style="margin:0 0 10px">${line}</p>`)
      .join('');
    setOutput('ideaResult', html || '⚠ No output returned.', true);
  } catch {
    setOutput('ideaResult', '⚠ Could not reach API server. Make sure it\'s running on localhost:8000.');
  }
  setLoading('ideasBtn', false);
}

/* ═══ CAMPAIGN GENERATOR ═══ */
async function generateCampaign() {
  const product = document.getElementById('product').value.trim();
  const target  = document.getElementById('target').value.trim();
  if (!product || !target) {
    setOutput('campaignResult', '⚠ Please fill in both fields.');
    return;
  }
  setLoading('campBtn', true);
  try {
    const r = await fetch(`${API}/campaign?product=${encodeURIComponent(product)}&target=${encodeURIComponent(target)}`);
    const d = await r.json();
    setOutput('campaignResult', d.campaign);
  } catch {
    setOutput('campaignResult', '⚠ Could not reach API server. Make sure it\'s running on localhost:8000.');
  }
  setLoading('campBtn', false);
}

/* ═══ SENTIMENT ANALYZER (multi-review) ═══ */
async function analyzeReviews() {
  const raw = document.getElementById('reviews').value.trim();
  if (!raw) return;

  const reviews = raw.split(',').map(r => r.trim()).filter(Boolean);
  setLoading('sentBtn', true);
  setOutput('insightsResult', '');

  let positive = 0, negative = 0, neutral = 0;
  const results = [];

  try {
    for (const text of reviews) {
      const r = await fetch(`${API}/sentiment?text=${encodeURIComponent(text)}`);
      const d = await r.json();
      const label = d.sentiment[0].label;
      const score = +(d.sentiment[0].score ?? 0.5).toFixed(2);
      if      (label === 'POSITIVE') positive++;
      else if (label === 'NEGATIVE') negative++;
      else                           neutral++;
      results.push({ text, label, score });
    }

    // Chart
    if (sentimentChart) sentimentChart.destroy();
    sentimentChart = new Chart(document.getElementById('sentimentChart'), {
      type: 'doughnut',
      data: {
        labels: ['Positive', 'Negative', 'Neutral'],
        datasets: [{
          data: [positive, negative, neutral],
          backgroundColor: ['rgba(74,222,128,0.75)', 'rgba(251,113,133,0.75)', 'rgba(99,179,237,0.3)'],
          borderColor:     ['#4ade80', '#fb7185', 'rgba(79,156,249,0.4)'],
          borderWidth: 1.5, hoverOffset: 10
        }]
      },
      options: {
        ...chartDefaults, cutout: '68%', scales: undefined,
        plugins: {
          ...chartDefaults.plugins,
          legend: { position: 'bottom', labels: { color: 'rgba(200,218,255,0.55)', padding: 16, font: { size: 12 } } }
        }
      }
    });

    // Insights summary
    const total = reviews.length;
    const pct   = v => Math.round((v / total) * 100);
    const lines = [
      `📊 Analyzed ${total} review${total > 1 ? 's' : ''} — ${pct(positive)}% Positive · ${pct(negative)}% Negative · ${pct(neutral)}% Neutral`,
      '',
      ...results.map((r, i) =>
        `${i + 1}. "${r.text}" → ${r.label === 'POSITIVE' ? '✅' : r.label === 'NEGATIVE' ? '❌' : '➖'} ${r.label} (${(r.score * 100).toFixed(0)}%)`
      )
    ].join('\n');

    setOutput('insightsResult', lines);

  } catch {
    setOutput('insightsResult', '⚠ Could not reach API server. Make sure it\'s running on localhost:8000.');
  }

  setLoading('sentBtn', false);
}

/* ═══ MARKET TRENDS ═══ */
async function getTrends() {
  const keyword = document.getElementById('trendKeyword').value.trim();
  if (!keyword) return;
  setLoading('trendBtn', true);
  try {
    const r      = await fetch(`${API}/trends?keyword=${encodeURIComponent(keyword)}`);
    const d      = await r.json();
    const trends = d.trends || d;
    const labels = trends.map(i => i.date);
    const values = trends.map(i => i[keyword]);

    if (trendChart) trendChart.destroy();
    trendChart = new Chart(document.getElementById('trendChart'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `"${keyword}" Trend`,
          data: values,
          borderColor: '#818cf8',
          backgroundColor: (ctx) => {
            const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
            g.addColorStop(0, 'rgba(129,140,248,0.25)');
            g.addColorStop(1, 'rgba(129,140,248,0)');
            return g;
          },
          fill: true, tension: 0.4,
          pointRadius: 3, pointHoverRadius: 6,
          pointBackgroundColor: '#818cf8',
          borderWidth: 2
        }]
      },
      options: { ...chartDefaults, animation: { duration: 800 } }
    });
  } catch { /* silent */ }
  setLoading('trendBtn', false);
}

/* ═══ SALES PREDICTION ═══ */
async function predictSales() {
  const month = parseInt(document.getElementById('monthInput').value);
  if (!month || month < 1 || month > 12) return;
  setLoading('salesBtn', true);
  try {
    const r = await fetch(`${API}/predict?month=${month}`);
    const d = await r.json();

    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const colors = MONTHS.map((_, i) =>
      i + 1 === month ? 'rgba(251,191,36,0.85)' : 'rgba(79,156,249,0.15)'
    );
    const borders = MONTHS.map((_, i) =>
      i + 1 === month ? '#fbbf24' : 'rgba(79,156,249,0.3)'
    );

    if (salesChart) salesChart.destroy();
    salesChart = new Chart(document.getElementById('salesChart'), {
      type: 'bar',
      data: {
        labels: MONTHS,
        datasets: [{
          label: 'Sales Forecast',
          data: MONTHS.map((_, i) => i + 1 === month ? d.prediction : null),
          backgroundColor: colors,
          borderColor: borders,
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        ...chartDefaults,
        animation: { duration: 700 },
        plugins: { ...chartDefaults.plugins }
      }
    });
  } catch { /* silent */ }
  setLoading('salesBtn', false);
}

/* ═══ COMPETITOR INTELLIGENCE ═══ */
async function analyzeCompetitor() {
  const company = document.getElementById('competitorInput').value.trim();
  if (!company) return;
  setLoading('compBtn', true);
  setOutput('competitorResult', '');
  try {
    const r = await fetch(`${API}/competitor?company=${encodeURIComponent(company)}`);
    const d = await r.json();
    setOutput('competitorResult', d.analysis.replace(/\n/g, '<br>'), true);
  } catch {
    setOutput('competitorResult', '⚠ Could not reach API server. Make sure it\'s running on localhost:8000.', false);
  }
  setLoading('compBtn', false);
}
