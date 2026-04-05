/**
 * Grey Ammonia Production Dashboard – Synthetic Dataset
 * Based on typical SMR-based Grey Ammonia plant with Reciprocating Compressors.
 * 365 daily records for 2024.
 */

(function () {
  const DESIGN_CAPACITY = 518; // MT/day

  function rand(min, max, decimals = 1) {
    const v = min + Math.random() * (max - min);
    return +v.toFixed(decimals);
  }

  function seeded(day, amp, period, offset = 0) {
    return amp * Math.sin((2 * Math.PI * (day + offset)) / period);
  }

  const dailyData = [];
  const start = new Date("2024-01-01");

  for (let d = 0; d < 365; d++) {
    const date = new Date(start);
    date.setDate(start.getDate() + d);
    const dateStr = date.toISOString().slice(0, 10);

    // Seasonal production variation + random noise
    const seasonalFactor = 1 + seeded(d, 0.04, 365, 90);
    const baseProduction = 450 * seasonalFactor;
    const production = rand(baseProduction - 15, baseProduction + 15);

    const capacity_pct = +((production / DESIGN_CAPACITY) * 100).toFixed(1);

    // Energy
    const energy_intensity = rand(9.0, 9.6, 2);
    const ng_consumption = +(production * energy_intensity * 0.948).toFixed(0); // GJ→MMBTU

    // Emissions (Grey Ammonia: ~1.8–1.9 tCO2/tNH3)
    const co2_intensity = rand(1.80, 1.92, 3);
    const co2_mt = +(production * co2_intensity).toFixed(1);

    // Compressor — inject anomaly spikes around day 145 and day 280
    const spikeDay145 = d >= 143 && d <= 147;
    const spikeDay280 = d >= 278 && d <= 282;

    const suction_pressure = rand(2.6, 3.0, 2);
    const discharge_pressure = rand(148, 156, 1);
    const suction_temp = rand(35, 42, 1);
    const discharge_temp = rand(138, 148, 1);

    let vibration, lube_oil_pressure;
    if (spikeDay145) {
      vibration = rand(7.5, 10.2, 2); // FAULT level
      lube_oil_pressure = rand(2.4, 2.7, 2);
    } else if (spikeDay280) {
      vibration = rand(6.2, 7.8, 2); // WARNING/FAULT level
      lube_oil_pressure = rand(2.6, 2.9, 2);
    } else {
      vibration = rand(2.8, 5.5, 2);
      lube_oil_pressure = rand(3.0, 3.4, 2);
    }

    let status;
    if (vibration >= 7.1 || lube_oil_pressure < 2.8) status = "FAULT";
    else if (vibration >= 5.6 || lube_oil_pressure < 3.0) status = "WARNING";
    else status = "HEALTHY";

    dailyData.push({
      date: dateStr,
      production_mt: production,
      capacity_pct,
      ng_consumption,
      energy_intensity,
      co2_mt,
      co2_intensity,
      suction_pressure,
      discharge_pressure,
      suction_temp,
      discharge_temp,
      vibration,
      lube_oil_pressure,
      status
    });
  }

  // ---- Monthly aggregates ----
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const MONTH_TARGETS = [13500,12800,13800,13500,14200,14000,14500,14400,14000,13800,13200,13000];

  const monthlyData = MONTHS.map((label, mi) => {
    const rows = dailyData.filter(r => new Date(r.date).getMonth() === mi);
    const total_production = +rows.reduce((s, r) => s + r.production_mt, 0).toFixed(0);
    const avg_energy = +(rows.reduce((s, r) => s + r.energy_intensity, 0) / rows.length).toFixed(2);
    const total_co2 = +rows.reduce((s, r) => s + r.co2_mt, 0).toFixed(0);
    const avg_co2_intensity = +(rows.reduce((s, r) => s + r.co2_intensity, 0) / rows.length).toFixed(3);
    const avg_capacity = +(rows.reduce((s, r) => s + r.capacity_pct, 0) / rows.length).toFixed(1);
    const ng_total = +rows.reduce((s, r) => s + r.ng_consumption, 0).toFixed(0);
    return {
      month: label,
      total_production,
      target: MONTH_TARGETS[mi],
      avg_energy,
      total_co2,
      avg_co2_intensity,
      avg_capacity,
      ng_total
    };
  });

  // ---- Overall KPIs ----
  const kpi = {
    total_production: +dailyData.reduce((s, r) => s + r.production_mt, 0).toFixed(0),
    avg_daily_production: +(dailyData.reduce((s, r) => s + r.production_mt, 0) / 365).toFixed(1),
    avg_capacity: +(dailyData.reduce((s, r) => s + r.capacity_pct, 0) / 365).toFixed(1),
    avg_energy_intensity: +(dailyData.reduce((s, r) => s + r.energy_intensity, 0) / 365).toFixed(2),
    avg_co2_intensity: +(dailyData.reduce((s, r) => s + r.co2_intensity, 0) / 365).toFixed(3),
    total_co2: +dailyData.reduce((s, r) => s + r.co2_mt, 0).toFixed(0),
    fault_days: dailyData.filter(r => r.status === "FAULT").length,
    warning_days: dailyData.filter(r => r.status === "WARNING").length
  };

  // Expose globally
  window.ammoniaData = { dailyData, monthlyData, kpi, MONTHS, DESIGN_CAPACITY };
})();
