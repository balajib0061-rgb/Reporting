/**
 * Grey Ammonia Dashboard – Chart Builders (Chart.js 4.x)
 */

// ---- Palette ----
const AM_ORANGE  = "#e65100";
const AM_AMBER   = "#f57c00";
const AM_YELLOW  = "#fbc02d";
const AM_TEAL    = "#00695c";
const AM_BLUE    = "#1565c0";
const AM_RED     = "#c62828";
const AM_GREEN   = "#2e7d32";
const AM_GREY    = "#607d8b";
const AM_WARN    = "#f9a825";

// ---- Shared tooltip style ----
const TT = {
  backgroundColor: "#1a1a2e",
  titleColor: "#f57c00",
  bodyColor: "#ffffff",
  padding: 10,
  cornerRadius: 6
};

function lineOpts(yLabel, yMin) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: { legend: { position: "top", labels: { boxWidth: 12, padding: 14 } }, tooltip: TT },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#555", maxTicksLimit: 12 } },
      y: {
        beginAtZero: yMin === 0,
        min: yMin,
        title: { display: !!yLabel, text: yLabel, color: "#555", font: { size: 11 } },
        grid: { color: "rgba(0,0,0,0.06)" },
        ticks: { color: "#555" }
      }
    }
  };
}

// Subsample daily array to every Nth point for readability
function subsample(arr, n) {
  return arr.filter((_, i) => i % n === 0);
}

// ============================================================
// TAB 1 – PRODUCTION CHARTS
// ============================================================
let prodDailyChart, prodMonthlyChart, capGaugeChart;

function buildProductionCharts() {
  const { dailyData, monthlyData, MONTHS, DESIGN_CAPACITY } = window.ammoniaData;
  const sampled = subsample(dailyData, 3); // every 3rd day → ~122 points

  // 1a. Daily production trend
  const ctx1 = document.getElementById("prodDailyChart").getContext("2d");
  prodDailyChart = new Chart(ctx1, {
    type: "line",
    data: {
      labels: sampled.map(r => r.date),
      datasets: [
        {
          label: "NH₃ Production (MT/day)",
          data: sampled.map(r => r.production_mt),
          borderColor: AM_ORANGE,
          backgroundColor: AM_ORANGE + "18",
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 5,
          fill: true
        },
        {
          label: "Design Capacity (MT/day)",
          data: sampled.map(() => DESIGN_CAPACITY),
          borderColor: AM_GREY,
          borderDash: [6, 4],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: lineOpts("MT / day", undefined)
  });

  // 1b. Monthly production vs target (grouped bar)
  const ctx2 = document.getElementById("prodMonthlyChart").getContext("2d");
  prodMonthlyChart = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: MONTHS,
      datasets: [
        {
          label: "Actual (MT)",
          data: monthlyData.map(m => m.total_production),
          backgroundColor: AM_ORANGE + "cc",
          borderRadius: 4
        },
        {
          label: "Target (MT)",
          data: monthlyData.map(m => m.target),
          backgroundColor: AM_GREY + "55",
          borderColor: AM_GREY,
          borderWidth: 1.5,
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "top", labels: { boxWidth: 12 } }, tooltip: TT },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: false, title: { display: true, text: "MT / month", color: "#555", font: { size: 11 } }, grid: { color: "rgba(0,0,0,0.06)" } }
      }
    }
  });

  // 1c. Capacity utilization doughnut
  const avgCap = window.ammoniaData.kpi.avg_capacity;
  const ctx3 = document.getElementById("capGaugeChart").getContext("2d");
  capGaugeChart = new Chart(ctx3, {
    type: "doughnut",
    data: {
      labels: ["Utilized", "Available"],
      datasets: [{
        data: [avgCap, 100 - avgCap],
        backgroundColor: [AM_ORANGE, "#e0e0e0"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      rotation: -90,
      circumference: 180,
      plugins: {
        legend: { display: false },
        tooltip: { ...TT, callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` } }
      }
    }
  });
}

// ============================================================
// TAB 2 – ENERGY CHARTS
// ============================================================
let energyIntChart, energyBreakChart;

function buildEnergyCharts() {
  const { monthlyData, MONTHS } = window.ammoniaData;

  // 2a. Energy intensity by month (line)
  const ctx1 = document.getElementById("energyIntChart").getContext("2d");
  energyIntChart = new Chart(ctx1, {
    type: "line",
    data: {
      labels: MONTHS,
      datasets: [{
        label: "Energy Intensity (GJ/MT NH₃)",
        data: monthlyData.map(m => m.avg_energy),
        borderColor: AM_AMBER,
        backgroundColor: AM_AMBER + "22",
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        fill: true
      }]
    },
    options: lineOpts("GJ / MT NH₃", 8.5)
  });

  // 2b. Energy breakdown stacked bar (NG ~85%, Steam ~10%, Power ~5%)
  const ctx2 = document.getElementById("energyBreakChart").getContext("2d");
  energyBreakChart = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: MONTHS,
      datasets: [
        {
          label: "Natural Gas (MMBTU)",
          data: monthlyData.map(m => +(m.ng_total * 0.85).toFixed(0)),
          backgroundColor: AM_AMBER + "cc",
          stack: "energy",
          borderRadius: 2
        },
        {
          label: "Steam (MMBTU equiv.)",
          data: monthlyData.map(m => +(m.ng_total * 0.10).toFixed(0)),
          backgroundColor: AM_TEAL + "cc",
          stack: "energy",
          borderRadius: 2
        },
        {
          label: "Electricity (MMBTU equiv.)",
          data: monthlyData.map(m => +(m.ng_total * 0.05).toFixed(0)),
          backgroundColor: AM_BLUE + "cc",
          stack: "energy",
          borderRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index" },
      plugins: { legend: { position: "top", labels: { boxWidth: 12 } }, tooltip: TT },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, title: { display: true, text: "MMBTU / month", color: "#555", font: { size: 11 } }, grid: { color: "rgba(0,0,0,0.06)" } }
      }
    }
  });
}

// ============================================================
// TAB 3 – EMISSIONS CHARTS
// ============================================================
let co2TrendChart, co2IntChart, emSrcChart;

function buildEmissionsCharts() {
  const { monthlyData, MONTHS } = window.ammoniaData;

  // 3a. Monthly CO2 trend
  const ctx1 = document.getElementById("co2TrendChart").getContext("2d");
  co2TrendChart = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: MONTHS,
      datasets: [{
        label: "CO₂ Emissions (MT/month)",
        data: monthlyData.map(m => m.total_co2),
        backgroundColor: AM_RED + "aa",
        borderColor: AM_RED,
        borderWidth: 1.5,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: TT },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: false, title: { display: true, text: "MT CO₂ / month", color: "#555", font: { size: 11 } }, grid: { color: "rgba(0,0,0,0.06)" } }
      }
    }
  });

  // 3b. CO2 intensity by month (line)
  const ctx2 = document.getElementById("co2IntChart").getContext("2d");
  co2IntChart = new Chart(ctx2, {
    type: "line",
    data: {
      labels: MONTHS,
      datasets: [{
        label: "CO₂ Intensity (tCO₂/MT NH₃)",
        data: monthlyData.map(m => m.avg_co2_intensity),
        borderColor: AM_RED,
        backgroundColor: AM_RED + "18",
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        fill: true
      }]
    },
    options: lineOpts("tCO₂ / MT NH₃", 1.7)
  });

  // 3c. Emission source doughnut
  const ctx3 = document.getElementById("emSrcChart").getContext("2d");
  emSrcChart = new Chart(ctx3, {
    type: "doughnut",
    data: {
      labels: ["Process CO₂ (SMR)", "Fuel Combustion", "Utilities"],
      datasets: [{
        data: [60, 32, 8],
        backgroundColor: [AM_RED, AM_AMBER, AM_GREY],
        borderWidth: 2,
        borderColor: "#fff",
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "55%",
      plugins: {
        legend: { position: "right", labels: { boxWidth: 12, padding: 12 } },
        tooltip: { ...TT, callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` } }
      }
    }
  });
}

// ============================================================
// TAB 4 – COMPRESSOR HEALTH CHARTS
// ============================================================
let pressureChart, tempChart, vibChart, lubChart;

function buildCompressorCharts() {
  const { dailyData } = window.ammoniaData;
  const sampled = subsample(dailyData, 3);
  const labels = sampled.map(r => r.date);

  // 4a. Pressure: suction vs discharge
  const ctx1 = document.getElementById("pressureChart").getContext("2d");
  pressureChart = new Chart(ctx1, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Suction Pressure (bar)",
          data: sampled.map(r => r.suction_pressure),
          borderColor: AM_TEAL,
          backgroundColor: "transparent",
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
          yAxisID: "yL"
        },
        {
          label: "Discharge Pressure (bar)",
          data: sampled.map(r => r.discharge_pressure),
          borderColor: AM_ORANGE,
          backgroundColor: "transparent",
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
          yAxisID: "yR"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: { legend: { position: "top", labels: { boxWidth: 12 } }, tooltip: TT },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 12 } },
        yL: { position: "left",  title: { display: true, text: "Suction (bar)",    color: AM_TEAL,   font: { size: 11 } }, grid: { color: "rgba(0,0,0,0.06)" } },
        yR: { position: "right", title: { display: true, text: "Discharge (bar)",  color: AM_ORANGE, font: { size: 11 } }, grid: { drawOnChartArea: false } }
      }
    }
  });

  // 4b. Temperature: suction vs discharge
  const ctx2 = document.getElementById("tempChart").getContext("2d");
  tempChart = new Chart(ctx2, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Suction Temp (°C)",
          data: sampled.map(r => r.suction_temp),
          borderColor: AM_BLUE,
          backgroundColor: "transparent",
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
          yAxisID: "yL"
        },
        {
          label: "Discharge Temp (°C)",
          data: sampled.map(r => r.discharge_temp),
          borderColor: AM_RED,
          backgroundColor: "transparent",
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
          yAxisID: "yR"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: { legend: { position: "top", labels: { boxWidth: 12 } }, tooltip: TT },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 12 } },
        yL: { position: "left",  title: { display: true, text: "Suction (°C)",    color: AM_BLUE, font: { size: 11 } }, grid: { color: "rgba(0,0,0,0.06)" } },
        yR: { position: "right", title: { display: true, text: "Discharge (°C)",  color: AM_RED,  font: { size: 11 } }, grid: { drawOnChartArea: false } }
      }
    }
  });

  // 4c. Vibration bar chart with threshold annotation
  const ctx3 = document.getElementById("vibChart").getContext("2d");
  vibChart = new Chart(ctx3, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Vibration (mm/s)",
          data: sampled.map(r => r.vibration),
          backgroundColor: sampled.map(r =>
            r.vibration >= 7.1 ? AM_RED + "cc" :
            r.vibration >= 5.6 ? AM_WARN + "cc" :
            AM_GREEN + "88"
          ),
          borderWidth: 0,
          borderRadius: 2
        },
        {
          label: "Fault Threshold (7.1 mm/s)",
          data: sampled.map(() => 7.1),
          type: "line",
          borderColor: AM_RED,
          borderDash: [6, 4],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "top", labels: { boxWidth: 12 } }, tooltip: TT },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 12 } },
        y: { beginAtZero: true, title: { display: true, text: "mm/s", color: "#555", font: { size: 11 } }, grid: { color: "rgba(0,0,0,0.06)" } }
      }
    }
  });

  // 4d. Lube oil pressure
  const ctx4 = document.getElementById("lubChart").getContext("2d");
  lubChart = new Chart(ctx4, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Lube Oil Pressure (bar)",
          data: sampled.map(r => r.lube_oil_pressure),
          borderColor: AM_AMBER,
          backgroundColor: AM_AMBER + "22",
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
          fill: true
        },
        {
          label: "Min Threshold (2.8 bar)",
          data: sampled.map(() => 2.8),
          borderColor: AM_RED,
          borderDash: [6, 4],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: lineOpts("bar", 2.2)
  });
}
