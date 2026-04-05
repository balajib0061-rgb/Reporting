/**
 * lca_charts.js
 * ============================================================
 * All chart builders for the LCA Dashboard.
 * Depends on: lca_data.js (LCA_DATA must be loaded first)
 * Libraries:  Chart.js 4.4, Plotly.js 2.27
 * ============================================================
 */

// ---- Shared colour references ----
const COL = {
  grey:  { solid: '#6B7280', light: 'rgba(107,114,128,0.18)', border: '#4B5563' },
  blue:  { solid: '#2563EB', light: 'rgba(37,99,235,0.18)',   border: '#1D4ED8' },
  green: { solid: '#16A34A', light: 'rgba(22,163,74,0.18)',   border: '#15803D' },
};

// ---- Shared tooltip style ----
const TT = {
  backgroundColor: '#1E293B',
  titleColor:      '#E2E8F0',
  bodyColor:       '#CBD5E1',
  borderColor:     '#334155',
  borderWidth:     1,
  padding:         10,
  cornerRadius:    6,
};

// ---- Helper: format scientific notation ----
function fmtSci(v) {
  if (v === 0) return '0';
  const e = Math.floor(Math.log10(Math.abs(v)));
  if (e >= -2 && e <= 4) return parseFloat(v.toPrecision(4)).toString();
  return v.toExponential(3);
}

// ---- Helper: percent change with sign and colour class ----
function pctChange(base, val) {
  const d = ((val - base) / base) * 100;
  return { text: (d >= 0 ? '+' : '') + d.toFixed(1) + '%', cls: d < 0 ? 'pct-better' : 'pct-worse' };
}

// ---- Shared scale defaults ----
function scaleX() {
  return { grid: { display: false }, ticks: { color: '#475569' } };
}
function scaleY(label) {
  return {
    beginAtZero: true,
    title: { display: !!label, text: label, color: '#64748B', font: { size: 10 } },
    grid: { color: 'rgba(0,0,0,0.05)' },
    ticks: { color: '#64748B' },
  };
}

// ============================================================
// CHART 1 — Total Impact Bar Chart
// ============================================================
function buildTotalBar() {
  const ss = LCA_DATA.singleScore;

  // Update KPI cards
  document.getElementById('kpiGrey').textContent  = ss.grey.toFixed(3) + ' Pt';
  document.getElementById('kpiBlue').textContent  = ss.blue.toFixed(3) + ' Pt';
  document.getElementById('kpiGreen').textContent = ss.green.toFixed(3) + ' Pt';
  document.getElementById('kpiBluePct').textContent  =
    pctChange(ss.grey, ss.blue).text + ' vs Grey';
  document.getElementById('kpiGreenPct').textContent =
    pctChange(ss.grey, ss.green).text + ' vs Grey';

  const ctx = document.getElementById('totalBarChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Grey Ammonia (A)', 'Blue Ammonia (B)', 'Green Ammonia (C)'],
      datasets: [{
        label: 'Single Score (Pt)',
        data:  [ss.grey, ss.blue, ss.green],
        backgroundColor: [COL.grey.light, COL.blue.light, COL.green.light],
        borderColor:     [COL.grey.solid, COL.blue.solid, COL.green.solid],
        borderWidth:   2,
        borderRadius:  6,
        hoverBorderWidth: 3,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...TT,
          callbacks: {
            label: ctx => ` Single Score: ${ctx.parsed.y.toFixed(3)} Pt`,
            afterLabel: ctx => {
              const pct = ((ctx.parsed.y / ss.grey) * 100).toFixed(1);
              return ` (${pct}% of Grey Ammonia)`;
            },
          },
        },
      },
      scales: {
        x: scaleX(),
        y: scaleY('Single Score (Pt)'),
      },
    },
  });
}

// ============================================================
// CHART 2 — Endpoint Category Charts (HH, Eco, Resources)
// ============================================================
function buildEndpointCharts() {
  const ep = LCA_DATA.endpoints;
  const labels = ['Grey (A)', 'Blue (B)', 'Green (C)'];
  const bgs    = [COL.grey.light, COL.blue.light, COL.green.light];
  const bords  = [COL.grey.solid, COL.blue.solid, COL.green.solid];

  function singleBar(id, data, yLabel, fmtFn) {
    const ctx = document.getElementById(id).getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: yLabel,
          data,
          backgroundColor: bgs,
          borderColor:     bords,
          borderWidth: 2,
          borderRadius: 5,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            ...TT,
            callbacks: { label: ctx => ` ${fmtFn(ctx.parsed.y)}` },
          },
        },
        scales: {
          x: scaleX(),
          y: scaleY(yLabel),
        },
      },
    });
  }

  singleBar('hhChart',
    [ep.humanHealth.grey, ep.humanHealth.blue, ep.humanHealth.green],
    'Human Health (DALY)',
    v => v.toExponential(4) + ' DALY');

  singleBar('ecoChart',
    [ep.ecosystems.grey * 1e5, ep.ecosystems.blue * 1e5, ep.ecosystems.green * 1e5],
    'Ecosystems (\u00D710\u207B\u2075 species.yr)',
    v => v.toFixed(3) + ' \u00D710\u207B\u2075 sp.yr');

  singleBar('resChart',
    [ep.resources.grey, ep.resources.blue, ep.resources.green],
    'Resources (USD2013)',
    v => v.toFixed(2) + ' USD2013');

  // ---- Grouped Normalized Bar ----
  const hhN   = [100, ep.humanHealth.blue  / ep.humanHealth.grey  * 100,
                      ep.humanHealth.green / ep.humanHealth.grey  * 100];
  const ecoN  = [100, ep.ecosystems.blue   / ep.ecosystems.grey   * 100,
                      ep.ecosystems.green  / ep.ecosystems.grey   * 100];
  const resN  = [100, ep.resources.blue    / ep.resources.grey    * 100,
                      ep.resources.green   / ep.resources.grey    * 100];

  const ctx = document.getElementById('groupedNormChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Human Health', data: hhN,  backgroundColor: 'rgba(239,68,68,0.70)',  borderColor: '#EF4444', borderWidth: 1.5, borderRadius: 4 },
        { label: 'Ecosystems',   data: ecoN, backgroundColor: 'rgba(34,197,94,0.70)', borderColor: '#22C55E', borderWidth: 1.5, borderRadius: 4 },
        { label: 'Resources',    data: resN, backgroundColor: 'rgba(249,115,22,0.70)',borderColor: '#F97316', borderWidth: 1.5, borderRadius: 4 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 12, padding: 16 } },
        tooltip: {
          ...TT,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}% of Grey`,
          },
        },
      },
      scales: {
        x: scaleX(),
        y: { ...scaleY('% of Grey Ammonia (= 100)'), beginAtZero: true },
      },
    },
  });
}

// ============================================================
// CHART 3 — Stacked Bar + Donut Charts (Life-cycle stages)
// ============================================================
function buildLifecycleCharts() {
  const { stages } = LCA_DATA;

  // ---- Stacked bar ----
  const ctx = document.getElementById('stackedChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: stages.caseLabels,
      datasets: stages.datasets.map(ds => ({
        label:           ds.label,
        data:            ds.data,
        backgroundColor: ds.color + 'CC',
        borderColor:     ds.color,
        borderWidth:     1,
        borderRadius:    3,
        stack:           'stack',
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index' },
      plugins: {
        legend: { position: 'right', labels: { boxWidth: 12, padding: 10, font: { size: 11 } } },
        tooltip: {
          ...TT,
          callbacks: {
            label: ctx => ctx.parsed.y > 0
              ? ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(3)} Pt`
              : null,
          },
        },
      },
      scales: {
        x: { stacked: true, ...scaleX() },
        y: { stacked: true, ...scaleY('Single Score (Pt)') },
      },
    },
  });

  // ---- Donut helper ----
  function buildDonut(canvasId, caseIndex) {
    const active = stages.datasets.filter(d => d.data[caseIndex] > 0);
    const data   = active.map(d => d.data[caseIndex]);
    const total  = data.reduce((a, b) => a + b, 0);

    const ctx2 = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels:   active.map(d => d.label),
        datasets: [{
          data,
          backgroundColor: active.map(d => d.color + 'CC'),
          borderColor:     active.map(d => d.color),
          borderWidth: 1.5,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 10, padding: 8, font: { size: 10 } } },
          tooltip: {
            ...TT,
            callbacks: {
              label: ctx =>
                ` ${ctx.label}: ${ctx.parsed.toFixed(3)} Pt (${(ctx.parsed / total * 100).toFixed(1)}%)`,
            },
          },
        },
      },
    });
  }

  buildDonut('greyDonut', 0);
  buildDonut('blueDonut', 1);
}

// ============================================================
// CHART 4 — Radar Chart (Midpoint trade-offs)
// ============================================================
function buildRadarChart() {
  const mp  = LCA_DATA.midpoint;
  const ctx = document.getElementById('radarChart').getContext('2d');

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels:   mp.radarLabels,
      datasets: [
        {
          label:           'Grey (A)',
          data:            mp.grey,
          backgroundColor: COL.grey.light,
          borderColor:     COL.grey.solid,
          borderWidth:     2,
          pointBackgroundColor: COL.grey.solid,
          pointRadius:     4,
        },
        {
          label:           'Blue (B)',
          data:            mp.blue,
          backgroundColor: COL.blue.light,
          borderColor:     COL.blue.solid,
          borderWidth:     2,
          pointBackgroundColor: COL.blue.solid,
          pointRadius:     4,
        },
        {
          label:           'Green (C)',
          data:            mp.green,
          backgroundColor: COL.green.light,
          borderColor:     COL.green.solid,
          borderWidth:     2,
          pointBackgroundColor: COL.green.solid,
          pointRadius:     4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 12, padding: 16 } },
        tooltip: {
          ...TT,
          callbacks: {
            label: ctx =>
              ` ${ctx.dataset.label}: ${ctx.parsed.r.toFixed(1)} (Grey = 100)`,
          },
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          ticks: {
            stepSize:       200,
            color:          '#64748B',
            backdropColor:  'transparent',
            font:           { size: 9 },
          },
          grid:        { color: 'rgba(0,0,0,0.08)' },
          angleLines:  { color: 'rgba(0,0,0,0.08)' },
          pointLabels: { color: '#374151', font: { size: 10 } },
        },
      },
    },
  });
}

// ============================================================
// CHART 5 — Sankey Diagram (Plotly.js)
// ============================================================
function buildSankey() {
  const sk = LCA_DATA.sankey;

  const linkColors = sk.links.map(() => 'rgba(100,116,139,0.35)');

  Plotly.newPlot('sankeyChart', [{
    type:        'sankey',
    orientation: 'h',
    node: {
      pad:       20,
      thickness: 22,
      line:      { color: 'white', width: 0.5 },
      label:     sk.nodeLabels,
      color:     sk.nodeColors,
      hovertemplate: '<b>%{label}</b><br>Total flow: %{value:.1f} GJ equiv.<extra></extra>',
    },
    link: {
      source:        sk.links.map(l => l.source),
      target:        sk.links.map(l => l.target),
      value:         sk.links.map(l => l.value),
      color:         linkColors,
      hovertemplate: '%{source.label} \u2192 %{target.label}<br>%{value:.1f} GJ equiv.<extra></extra>',
    },
  }], {
    font:         { family: 'Segoe UI, system-ui, sans-serif', size: 11, color: '#1E293B' },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor:  'rgba(0,0,0,0)',
    margin:        { l: 10, r: 10, t: 20, b: 10 },
  }, {
    responsive:     true,
    displayModeBar: false,
  });
}

// ============================================================
// TABLE BUILDERS
// ============================================================
function buildSummaryTable() {
  const tbody = document.getElementById('summaryTableBody');
  const epColors = { HH: '#EF4444', Eco: '#22C55E', Res: '#F97316' };

  LCA_DATA.categories.forEach(cat => {
    const vals  = [cat.grey, cat.blue, cat.green];
    const minV  = Math.min(...vals);
    const best  = vals.indexOf(minV);
    const names = ['Grey', 'Blue', 'Green'];
    const bCls  = ['badge-grey', 'badge-blue', 'badge-green'];

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <span class="ep-dot" style="background:${epColors[cat.endpoint]}"></span>
        ${cat.label}
      </td>
      <td style="font-size:0.72rem;color:#64748B">${cat.unit}</td>
      <td>${fmtSci(cat.grey)}</td>
      <td>${fmtSci(cat.blue)}</td>
      <td>${fmtSci(cat.green)}</td>
      <td><span class="badge ${bCls[best]}">${names[best]}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function buildMidpointTable() {
  const tbody = document.getElementById('midpointTableBody');
  const abs   = LCA_DATA.midpoint.absolute;

  abs.labels.forEach((label, i) => {
    const bVsG = pctChange(abs.grey[i], abs.blue[i]);
    const gVsG = pctChange(abs.grey[i], abs.green[i]);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${label}</td>
      <td style="font-size:0.72rem;color:#64748B">${abs.units[i]}</td>
      <td>${fmtSci(abs.grey[i])}</td>
      <td>${fmtSci(abs.blue[i])}</td>
      <td>${fmtSci(abs.green[i])}</td>
      <td class="${bVsG.cls}">${bVsG.text}</td>
      <td class="${gVsG.cls}">${gVsG.text}</td>
    `;
    tbody.appendChild(tr);
  });
}
