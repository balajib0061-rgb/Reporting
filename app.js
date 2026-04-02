/**
 * ESG Dashboard – Application Controller
 * Handles tab switching, table rendering, filters, and CSV export.
 */

// ---- Tab navigation ----
function initTabs() {
  const navBtns = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".tab-content");

  function activateTab(tabId) {
    sections.forEach(s => s.classList.remove("active"));
    navBtns.forEach(b => b.classList.remove("active"));

    const target = document.getElementById("tab-" + tabId);
    if (target) target.classList.add("active");

    const btn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
    if (btn) btn.classList.add("active");
  }

  navBtns.forEach(btn => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab));
  });

  // Summary card buttons
  document.querySelectorAll(".card-btn[data-tab]").forEach(btn => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab));
  });
}

// ---- Render Environment table ----
function renderEnvTable(data) {
  const tbody = document.getElementById("envTableBody");
  tbody.innerHTML = data.slice(0, 40).map(row => `
    <tr>
      <td>${row.industry}</td>
      <td>${row.year}</td>
      <td>${row.energy.toFixed(1)}</td>
      <td>${row.ghg.toFixed(2)}</td>
      <td>${row.region}</td>
    </tr>`).join("");
}

// ---- Render Social table ----
function renderSocTable(data) {
  const tbody = document.getElementById("socTableBody");
  tbody.innerHTML = data.slice(0, 40).map(row => `
    <tr>
      <td>${row.metric}</td>
      <td>${row.group}</td>
      <td>${row.year}</td>
      <td>${typeof row.value === "number" ? row.value.toFixed(1) : row.value}</td>
      <td>${row.unit}</td>
    </tr>`).join("");
}

// ---- CSV export ----
function toCSV(headers, rows) {
  const lines = [headers.join(",")];
  rows.forEach(r => lines.push(r.map(v => `"${v}"`).join(",")));
  return lines.join("\n");
}

function downloadCSV(filename, csv) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function initCSV() {
  document.getElementById("downloadEnvCSV").addEventListener("click", () => {
    const csv = toCSV(
      ["Industry", "Year", "Energy_GJ_per_emp", "GHG_tCO2e_per_emp", "Region"],
      envTableData.map(r => [r.industry, r.year, r.energy, r.ghg, r.region])
    );
    downloadCSV("esg_environment_data.csv", csv);
  });

  document.getElementById("downloadSocCSV").addEventListener("click", () => {
    const csv = toCSV(
      ["Metric", "Group", "Year", "Value", "Unit"],
      socTableData.map(r => [r.metric, r.group, r.year, r.value, r.unit])
    );
    downloadCSV("esg_social_data.csv", csv);
  });
}

// ---- Environment filters ----
function initEnvFilters() {
  ["env-region", "env-metric", "env-variable"].forEach(id => {
    document.getElementById(id).addEventListener("change", () => {
      const region   = document.getElementById("env-region").value;
      const metric   = document.getElementById("env-metric").value;
      const variable = document.getElementById("env-variable").value;

      // Update chart titles based on filter
      const isShares = metric === "shares";
      const bySource = variable === "source";

      // Adjust visibility / labels
      const energyCard = document.getElementById("energyByIndustryChart").closest(".chart-card");
      const ghgCard    = document.getElementById("ghgByIndustryChart").closest(".chart-card");
      const srcCard    = document.getElementById("energyBySourceChart").closest(".chart-card");

      if (bySource) {
        energyCard.style.display = "none";
        ghgCard.style.display    = "none";
        srcCard.style.display    = "block";
      } else {
        energyCard.style.display = "block";
        ghgCard.style.display    = isShares ? "none" : "block";
        srcCard.style.display    = "none";
      }

      // Suffix for region label
      energyIndustryChart.options.plugins.title = {
        display: true,
        text: `Energy Use by Industry — ${region}`
      };
      energyIndustryChart.update();
    });
  });
}

// ---- Social filters ----
function initSocFilters() {
  ["soc-industry", "soc-region"].forEach(id => {
    document.getElementById(id).addEventListener("change", () => {
      // In a real app, this would re-query filtered data.
      // For demo, just re-render with the same data.
      renderSocTable(socTableData);
    });
  });
}

// ---- Boot ----
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  buildEnvCharts();
  buildSocCharts();
  renderEnvTable(envTableData);
  renderSocTable(socTableData);
  initCSV();
  initEnvFilters();
  initSocFilters();
});
