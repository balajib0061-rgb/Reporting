/**
 * lca_app.js
 * ============================================================
 * Tab navigation and dashboard initialisation.
 * Must be loaded LAST (after lca_data.js and lca_charts.js).
 * ============================================================
 */

// ---- Tab switching ----
function initTabs() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Update active button
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show the matching section, hide others
      document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
      const section = document.getElementById('tab-' + target);
      if (section) section.classList.add('active');
    });
  });
}

// ---- Initialise everything when the page is ready ----
document.addEventListener('DOMContentLoaded', () => {
  initTabs();

  // Build all charts and tables
  buildTotalBar();        // Chart 1: Total impact bar
  buildEndpointCharts();  // Chart 2: HH / Eco / Resources bars + grouped norm bar
  buildLifecycleCharts(); // Chart 3: Stacked bar + donut charts
  buildRadarChart();      // Chart 4: Midpoint radar
  buildSankey();          // Chart 5: Sankey process flow (Plotly)

  buildSummaryTable();    // Table: all 22 impact categories
  buildMidpointTable();   // Table: key midpoint absolute values
});
