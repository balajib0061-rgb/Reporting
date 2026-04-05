/**
 * Grey Ammonia Dashboard – Application Controller
 */

// ---- Tab navigation ----
function initTabs() {
  const navBtns  = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".tab-content");

  function activateTab(tabId) {
    sections.forEach(s => s.classList.remove("active"));
    navBtns.forEach(b => b.classList.remove("active"));
    const target = document.getElementById("tab-" + tabId);
    if (target) target.classList.add("active");
    const btn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
    if (btn) btn.classList.add("active");
  }

  navBtns.forEach(btn => btn.addEventListener("click", () => activateTab(btn.dataset.tab)));
}

// ---- KPI Strip ----
function populateKPIs() {
  const { kpi } = window.ammoniaData;

  document.getElementById("kpiProd").textContent   = kpi.avg_daily_production.toFixed(1);
  document.getElementById("kpiCap").textContent    = kpi.avg_capacity.toFixed(1);
  document.getElementById("kpiEnergy").textContent = kpi.avg_energy_intensity.toFixed(2);
  document.getElementById("kpiCO2").textContent    = kpi.avg_co2_intensity.toFixed(3);
  document.getElementById("kpiTotal").textContent  = (kpi.total_production / 1000).toFixed(1) + "k";

  // Compressor status summary
  const statusEl = document.getElementById("kpiStatus");
  const healthyDays = 365 - kpi.fault_days - kpi.warning_days;
  statusEl.innerHTML = `
    <span class="badge badge-healthy">✓ ${healthyDays}d Healthy</span>
    <span class="badge badge-warn">⚠ ${kpi.warning_days}d Warning</span>
    <span class="badge badge-fault">✕ ${kpi.fault_days}d Fault</span>
  `;

  // Gauge label
  const gaugeEl = document.getElementById("gaugeLabel");
  if (gaugeEl) gaugeEl.textContent = kpi.avg_capacity.toFixed(1) + "%";
}

// ---- Compressor status badges ----
function populateCompressorBadges() {
  const { kpi, dailyData } = window.ammoniaData;
  const row = document.getElementById("compStatusRow");
  if (!row) return;

  const latest = dailyData[dailyData.length - 1];
  const dotClass = latest.status === "HEALTHY" ? "dot-healthy"
                 : latest.status === "WARNING"  ? "dot-warn"
                 : "dot-fault";

  const healthyDays = 365 - kpi.fault_days - kpi.warning_days;

  row.innerHTML = `
    <div class="comp-badge">
      <span class="comp-badge-dot ${dotClass}"></span>
      <div>
        <div class="comp-badge-label">Current Status</div>
        <div class="comp-badge-val">${latest.status}</div>
      </div>
    </div>
    <div class="comp-badge">
      <span class="comp-badge-dot dot-healthy"></span>
      <div>
        <div class="comp-badge-label">Healthy Days</div>
        <div class="comp-badge-val">${healthyDays} / 365</div>
      </div>
    </div>
    <div class="comp-badge">
      <span class="comp-badge-dot dot-warn"></span>
      <div>
        <div class="comp-badge-label">Warning Days</div>
        <div class="comp-badge-val">${kpi.warning_days} / 365</div>
      </div>
    </div>
    <div class="comp-badge">
      <span class="comp-badge-dot dot-fault"></span>
      <div>
        <div class="comp-badge-label">Fault Days</div>
        <div class="comp-badge-val">${kpi.fault_days} / 365</div>
      </div>
    </div>
    <div class="comp-badge">
      <span class="comp-badge-dot dot-healthy"></span>
      <div>
        <div class="comp-badge-label">Last Vibration</div>
        <div class="comp-badge-val">${latest.vibration} mm/s</div>
      </div>
    </div>
    <div class="comp-badge">
      <span class="comp-badge-dot dot-healthy"></span>
      <div>
        <div class="comp-badge-label">Last Lube Oil P</div>
        <div class="comp-badge-val">${latest.lube_oil_pressure} bar</div>
      </div>
    </div>
  `;
}

// ---- Data Table ----
let filteredRows = [];
let currentPage  = 1;
const PAGE_SIZE  = 20;

function renderTable(rows, page) {
  const tbody = document.getElementById("tableBody");
  const start = (page - 1) * PAGE_SIZE;
  const slice = rows.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);

  tbody.innerHTML = slice.map(r => {
    const cls = r.status === "HEALTHY" ? "status-healthy"
              : r.status === "WARNING"  ? "status-warn"
              : "status-fault";
    return `<tr>
      <td>${r.date}</td>
      <td>${r.production_mt.toFixed(1)}</td>
      <td>${r.capacity_pct.toFixed(1)}</td>
      <td>${r.ng_consumption.toLocaleString()}</td>
      <td>${r.energy_intensity.toFixed(2)}</td>
      <td>${r.co2_mt.toFixed(1)}</td>
      <td>${r.co2_intensity.toFixed(3)}</td>
      <td>${r.suction_pressure.toFixed(2)}</td>
      <td>${r.discharge_pressure.toFixed(1)}</td>
      <td>${r.vibration.toFixed(2)}</td>
      <td>${r.lube_oil_pressure.toFixed(2)}</td>
      <td class="${cls}">${r.status}</td>
    </tr>`;
  }).join("");

  document.getElementById("pageInfo").textContent = `Page ${page} of ${totalPages}`;
  document.getElementById("prevPage").disabled = page === 1;
  document.getElementById("nextPage").disabled = page === totalPages;
}

function initTable() {
  const { dailyData } = window.ammoniaData;
  filteredRows = [...dailyData];
  renderTable(filteredRows, 1);

  document.getElementById("prevPage").addEventListener("click", () => {
    currentPage--;
    renderTable(filteredRows, currentPage);
  });
  document.getElementById("nextPage").addEventListener("click", () => {
    currentPage++;
    renderTable(filteredRows, currentPage);
  });

  document.getElementById("applyFilter").addEventListener("click", () => {
    const from = document.getElementById("dateFrom").value;
    const to   = document.getElementById("dateTo").value;
    filteredRows = dailyData.filter(r => r.date >= from && r.date <= to);
    currentPage = 1;
    renderTable(filteredRows, currentPage);
  });

  document.getElementById("resetFilter").addEventListener("click", () => {
    document.getElementById("dateFrom").value = "2024-01-01";
    document.getElementById("dateTo").value   = "2024-12-31";
    filteredRows = [...dailyData];
    currentPage  = 1;
    renderTable(filteredRows, currentPage);
  });
}

// ---- CSV Export ----
function initCSV() {
  document.getElementById("downloadCSV").addEventListener("click", () => {
    const headers = [
      "Date","Production_MT","Capacity_pct","NG_MMBTU","Energy_GJ_per_MT",
      "CO2_MT","CO2_intensity","Suction_P_bar","Discharge_P_bar",
      "Suction_T_C","Discharge_T_C","Vibration_mm_s","LubeOil_P_bar","Status"
    ];
    const rows = filteredRows.map(r => [
      r.date, r.production_mt, r.capacity_pct, r.ng_consumption,
      r.energy_intensity, r.co2_mt, r.co2_intensity,
      r.suction_pressure, r.discharge_pressure,
      r.suction_temp, r.discharge_temp,
      r.vibration, r.lube_oil_pressure, r.status
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "grey_ammonia_2024.csv";
    a.click();
    URL.revokeObjectURL(url);
  });
}

// ---- Boot ----
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  populateKPIs();
  buildProductionCharts();
  buildEnergyCharts();
  buildEmissionsCharts();
  buildCompressorCharts();
  populateCompressorBadges();
  initTable();
  initCSV();
});
