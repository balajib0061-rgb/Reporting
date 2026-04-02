/**
 * ESG Dashboard – Chart Initialization
 * Uses Chart.js 4.x
 */

// ---- Colour palettes ----
const ENV_COLORS = [
  "#1b5e20", "#388e3c", "#66bb6a", "#a5d6a7"
];
const SOC_COLORS = [
  "#0d47a1", "#1565c0", "#1976d2", "#42a5f5",
  "#90caf9", "#bbdefb"
];
const SOURCE_COLORS = [
  "#fbc02d", "#388e3c", "#1565c0", "#6a1b9a",
  "#bf360c", "#00838f", "#78909c"
];

// ---- Shared chart defaults ----
Chart.defaults.font.family = "'Segoe UI', 'BC Sans', Arial, sans-serif";
Chart.defaults.font.size   = 12;
Chart.defaults.color       = "#606060";

function lineOptions(title, yLabel) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "top", labels: { boxWidth: 12, padding: 16 } },
      tooltip: {
        backgroundColor: "#003366",
        titleColor: "#FCBA19",
        bodyColor: "#ffffff",
        padding: 10,
        cornerRadius: 6
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#606060" }
      },
      y: {
        beginAtZero: false,
        title: { display: !!yLabel, text: yLabel, color: "#606060", font: { size: 11 } },
        grid: { color: "rgba(0,0,0,0.06)" },
        ticks: { color: "#606060" }
      }
    }
  };
}

function barOptions(yLabel, horizontal = false) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? "y" : "x",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#003366",
        titleColor: "#FCBA19",
        bodyColor: "#ffffff",
        padding: 10,
        cornerRadius: 6
      }
    },
    scales: {
      x: { grid: { color: "rgba(0,0,0,0.06)" }, ticks: { color: "#606060" } },
      y: {
        beginAtZero: true,
        title: { display: !!yLabel, text: yLabel, color: "#606060", font: { size: 11 } },
        grid: { color: "rgba(0,0,0,0.06)" },
        ticks: { color: "#606060" }
      }
    }
  };
}

// ============================================================
// ENVIRONMENT CHARTS
// ============================================================

let energyIndustryChart, ghgIndustryChart, energySourceChart;

function buildEnvCharts() {
  // 1. Energy Use by Industry (line chart)
  const eiCtx = document.getElementById("energyByIndustryChart").getContext("2d");
  energyIndustryChart = new Chart(eiCtx, {
    type: "line",
    data: {
      labels: ENV_YEARS,
      datasets: INDUSTRIES.map((ind, i) => ({
        label: ind,
        data: energyByIndustry[ind],
        borderColor: ENV_COLORS[i],
        backgroundColor: ENV_COLORS[i] + "22",
        pointBackgroundColor: ENV_COLORS[i],
        borderWidth: 2.5,
        tension: 0.35,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 6
      }))
    },
    options: lineOptions("Energy Use by Industry", "GJ / employee")
  });

  // 2. GHG Emissions by Industry (line chart)
  const ghgCtx = document.getElementById("ghgByIndustryChart").getContext("2d");
  ghgIndustryChart = new Chart(ghgCtx, {
    type: "line",
    data: {
      labels: ENV_YEARS,
      datasets: INDUSTRIES.map((ind, i) => ({
        label: ind,
        data: ghgByIndustry[ind],
        borderColor: ENV_COLORS[i],
        backgroundColor: ENV_COLORS[i] + "22",
        pointBackgroundColor: ENV_COLORS[i],
        borderWidth: 2.5,
        tension: 0.35,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 6
      }))
    },
    options: lineOptions("GHG Emissions by Industry", "tCO₂e / employee")
  });

  // 3. Energy by Source (doughnut)
  const esCtx = document.getElementById("energyBySourceChart").getContext("2d");
  energySourceChart = new Chart(esCtx, {
    type: "doughnut",
    data: {
      labels: energySources,
      datasets: [{
        data: energySourceShares,
        backgroundColor: SOURCE_COLORS,
        borderWidth: 2,
        borderColor: "#fff",
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "55%",
      plugins: {
        legend: { position: "right", labels: { boxWidth: 12, padding: 12, font: { size: 11 } } },
        tooltip: {
          backgroundColor: "#003366",
          titleColor: "#FCBA19",
          bodyColor: "#ffffff",
          padding: 10,
          cornerRadius: 6,
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed}%`
          }
        }
      }
    }
  });
}

// ============================================================
// SOCIAL CHARTS
// ============================================================

let empAgeChart, overtimeChart, wageChart, absenceChart;

function buildSocCharts() {
  const ageColors = ["#1565c0", "#42a5f5", "#bbdefb"];

  // 1. Employment by age group (stacked bar)
  const ageCtx = document.getElementById("employmentAgeChart").getContext("2d");
  empAgeChart = new Chart(ageCtx, {
    type: "bar",
    data: {
      labels: SOC_YEARS,
      datasets: Object.entries(employmentAge).map(([grp, vals], i) => ({
        label: grp,
        data: vals,
        backgroundColor: ageColors[i],
        borderRadius: 2,
        stack: "age"
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index" },
      plugins: {
        legend: { position: "top", labels: { boxWidth: 12, padding: 14 } },
        tooltip: {
          backgroundColor: "#003366",
          titleColor: "#FCBA19",
          bodyColor: "#ffffff",
          padding: 10,
          cornerRadius: 6,
          callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` }
        }
      },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: {
          stacked: true,
          beginAtZero: true,
          max: 100,
          title: { display: true, text: "% of workforce", color: "#606060", font: { size: 11 } },
          grid: { color: "rgba(0,0,0,0.06)" }
        }
      }
    }
  });

  // 2. Overtime hours by gender (line)
  const otCtx = document.getElementById("overtimeGenderChart").getContext("2d");
  overtimeChart = new Chart(otCtx, {
    type: "line",
    data: {
      labels: SOC_YEARS,
      datasets: [
        {
          label: "Men+",
          data: overtimeGender["Men+"],
          borderColor: "#1565c0",
          backgroundColor: "#1565c022",
          pointBackgroundColor: "#1565c0",
          borderWidth: 2.5,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 7
        },
        {
          label: "Women+",
          data: overtimeGender["Women+"],
          borderColor: "#e91e8c",
          backgroundColor: "#e91e8c22",
          pointBackgroundColor: "#e91e8c",
          borderWidth: 2.5,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 7
        }
      ]
    },
    options: lineOptions("Overtime Hours by Gender", "hours / week")
  });

  // 3. Women by wage level (horizontal bar)
  const wgCtx = document.getElementById("wageRepChart").getContext("2d");
  wageChart = new Chart(wgCtx, {
    type: "bar",
    data: {
      labels: wageRepLabels,
      datasets: [{
        label: "% Women",
        data: wageRepData,
        backgroundColor: wageRepData.map((v, i) =>
          i === wageRepData.length - 1 ? "#003366" : "#42a5f5"
        ),
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#003366",
          titleColor: "#FCBA19",
          bodyColor: "#ffffff",
          padding: 10,
          cornerRadius: 6,
          callbacks: { label: ctx => ` ${ctx.parsed.x}%` }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: "% of employees", color: "#606060", font: { size: 11 } },
          grid: { color: "rgba(0,0,0,0.06)" }
        },
        y: { grid: { display: false } }
      }
    }
  });

  // 4. Work absences (line)
  const absColors = ["#1565c0", "#42a5f5", "#e91e8c", "#f48fb1"];
  const absSeries = Object.keys(workAbsence);
  const absCtx = document.getElementById("workAbsenceChart").getContext("2d");
  absenceChart = new Chart(absCtx, {
    type: "line",
    data: {
      labels: SOC_YEARS,
      datasets: absSeries.map((grp, i) => ({
        label: grp,
        data: workAbsence[grp],
        borderColor: absColors[i],
        backgroundColor: absColors[i] + "18",
        pointBackgroundColor: absColors[i],
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 6
      }))
    },
    options: lineOptions("Work Absences by Gender", "days / year")
  });
}
