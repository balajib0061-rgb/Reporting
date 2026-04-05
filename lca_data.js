/**
 * lca_data.js
 * ============================================================
 * LCA Data for Cradle-to-Gate Ammonia Production Pathways
 * Functional Unit: 1,000 kg NH3
 * Impact Method:   ReCiPe 2016 Endpoint (H)
 * ============================================================
 *
 * HOW TO UPDATE YOUR OWN DATA:
 *   1. Run your LCA in OpenLCA for Blue and Green cases.
 *   2. Export the impact results (same format as impact.csv).
 *   3. Replace every value marked with <-- REPLACE in this file.
 *   4. Save and refresh the dashboard in your browser.
 * ============================================================
 */

const LCA_DATA = {

  // ----------------------------------------------------------
  // SINGLE SCORE (Pt) — Weighted, normalized endpoint total
  // Grey = actual from OpenLCA. Blue & Green = placeholders.
  // ----------------------------------------------------------
  singleScore: {
    grey:  1.500,   // Pt  (actual)
    blue:  0.950,   // Pt  <-- REPLACE with your Blue result
    green: 0.400,   // Pt  <-- REPLACE with your Green result
  },

  // ----------------------------------------------------------
  // ENDPOINT DAMAGE CATEGORIES
  // Grey values are summed from the actual impact.csv results.
  // ----------------------------------------------------------
  endpoints: {
    humanHealth: {          // unit: DALY per 1,000 kg NH3
      grey:  0.011523,      // actual  (sum of 8 DALY categories)
      blue:  0.008320,      // <-- REPLACE
      green: 0.002470,      // <-- REPLACE
    },
    ecosystems: {           // unit: species.yr per 1,000 kg NH3
      grey:  5.667e-5,      // actual  (sum of 12 species.yr categories)
      blue:  3.950e-5,      // <-- REPLACE
      green: 1.720e-5,      // <-- REPLACE
    },
    resources: {            // unit: USD2013 per 1,000 kg NH3
      grey:  303.70,        // actual  (fossil + mineral resource scarcity)
      blue:  348.10,        // <-- REPLACE (higher: CCS energy penalty)
      green: 10.45,         // <-- REPLACE (lower: no fossil feedstock)
    },
  },

  // ----------------------------------------------------------
  // ALL 22 IMPACT CATEGORIES
  // Grey column = actual values from impact.csv (OpenLCA run).
  // Blue & Green = scaled estimates — replace with your data.
  //
  // Fields: label, unit, endpoint (HH/Eco/Res), grey, blue, green
  // ----------------------------------------------------------
  categories: [
    // ---- Human Health (DALY) ----
    {
      label: 'Fine particulate matter formation',
      unit: 'DALY', endpoint: 'HH',
      grey:  8.587e-4,   blue:  7.557e-4,   green: 4.294e-5,
    },
    {
      label: 'Global warming \u2013 Human health',
      unit: 'DALY', endpoint: 'HH',
      grey:  2.806e-3,   blue:  6.173e-4,   green: 8.418e-5,
    },
    {
      label: 'Human carcinogenic toxicity',
      unit: 'DALY', endpoint: 'HH',
      grey:  6.116e-5,   blue:  5.810e-5,   green: 4.893e-6,
    },
    {
      label: 'Human non-carcinogenic toxicity',
      unit: 'DALY', endpoint: 'HH',
      grey:  1.230e-4,   blue:  1.169e-4,   green: 9.840e-6,
    },
    {
      label: 'Ionizing radiation',
      unit: 'DALY', endpoint: 'HH',
      grey:  2.391e-6,   blue:  2.511e-6,   green: 1.196e-6,
    },
    {
      label: 'Ozone formation \u2013 Human health',
      unit: 'DALY', endpoint: 'HH',
      grey:  1.661e-6,   blue:  1.412e-6,   green: 6.644e-8,
    },
    {
      label: 'Stratospheric ozone depletion',
      unit: 'DALY', endpoint: 'HH',
      grey:  1.512e-7,   blue:  1.542e-7,   green: 4.536e-8,
    },
    {
      label: 'Water consumption \u2013 Human health',
      unit: 'DALY', endpoint: 'HH',
      grey:  7.670e-3,   blue:  8.054e-3,   green: 6.136e-3,
    },

    // ---- Ecosystems (species.yr) ----
    {
      label: 'Freshwater ecotoxicity',
      unit: 'species.yr', endpoint: 'Eco',
      grey:  7.360e-9,   blue:  7.728e-9,   green: 1.104e-9,
    },
    {
      label: 'Freshwater eutrophication',
      unit: 'species.yr', endpoint: 'Eco',
      grey:  2.173e-7,   blue:  2.217e-7,   green: 1.738e-8,
    },
    {
      label: 'Global warming \u2013 Freshwater ecosystems',
      unit: 'species.yr', endpoint: 'Eco',
      grey:  2.313e-10,  blue:  5.089e-11,  green: 6.939e-12,
    },
    {
      label: 'Global warming \u2013 Terrestrial ecosystems',
      unit: 'species.yr', endpoint: 'Eco',
      grey:  8.466e-6,   blue:  1.863e-6,   green: 2.540e-7,
    },
    {
      label: 'Land use',
      unit: 'species.yr', endpoint: 'Eco',
      grey:  1.359e-7,   blue:  1.563e-7,   green: 1.087e-6,
    },
    {
      label: 'Marine ecotoxicity',
      unit: 'species.yr', endpoint: 'Eco',
      grey:  1.612e-9,   blue:  1.644e-9,   green: 1.612e-10,
    },
    {
      label: 'Marine eutrophication',
      unit: 'species.yr', endpoint: 'Eco',
      grey:  7.120e-11,  blue:  7.191e-11,  green: 3.560e-12,
    },
    {
      label: 'Ozone formation \u2013 Terrestrial ecosystems',
      unit: 'species.yr', endpoint: 'Eco',
      grey:  2.426e-7,   blue:  2.062e-7,   green: 9.704e-9,
    },
    {
      label: 'Terrestrial acidification',
      unit: 'species.yr', endpoint: 'Eco',
      grey:  9.669e-7,   blue:  8.509e-7,   green: 4.835e-8,
    },
    {
      label: 'Terrestrial ecotoxicity',
      unit: 'species.yr', endpoint: 'Eco',
      grey:  1.099e-8,   blue:  1.154e-8,   green: 2.198e-9,
    },
    {
      label: 'Water consumption \u2013 Aquatic ecosystems',
      unit: 'species.yr', endpoint: 'Eco',
      grey:  2.087e-9,   blue:  2.504e-9,   green: 1.044e-9,
    },
    {
      label: 'Water consumption \u2013 Terrestrial ecosystems',
      unit: 'species.yr', endpoint: 'Eco',
      grey:  4.664e-5,   blue:  5.597e-5,   green: 3.731e-5,
    },

    // ---- Resources (USD2013) ----
    {
      label: 'Fossil resource scarcity',
      unit: 'USD2013', endpoint: 'Res',
      grey:  303.535,    blue:  358.571,    green: 12.141,
    },
    {
      label: 'Mineral resource scarcity',
      unit: 'USD2013', endpoint: 'Res',
      grey:  0.169,      blue:  0.228,      green: 1.607,
    },
  ],

  // ----------------------------------------------------------
  // MIDPOINT INDICATORS (7 key indicators)
  // Normalized: Grey = 100. All other values = % of Grey.
  // Replace blue[] and green[] with your actual results.
  // ----------------------------------------------------------
  midpoint: {
    radarLabels: [
      'Global Warming',
      'Fine Particulate\nMatter',
      'Fossil Resource\nScarcity',
      'Terrestrial\nAcidification',
      'Water\nConsumption',
      'Land Use',
      'Mineral Resource\nScarcity',
    ],

    // Normalized to Grey = 100
    grey:  [100,  100,  100,  100,  100,  100,  100 ],
    blue:  [ 22,   88,  118,   82,  110,  112,  135 ],  // <-- REPLACE
    green: [  4,    8,    4,    5,   80,  750,  920 ],  // <-- REPLACE

    // Absolute values for the comparison table
    absolute: {
      labels: [
        'Global Warming',
        'Fine Particulate Matter Formation',
        'Fossil Resource Scarcity',
        'Terrestrial Acidification',
        'Water Consumption',
        'Land Use',
        'Mineral Resource Scarcity',
      ],
      units: [
        'kg CO\u2082 eq',
        'kg PM\u2082.\u2085 eq',
        'kg oil eq',
        'kg SO\u2082 eq',
        'm\u00B3',
        'm\u00B2\u00B7yr',
        'kg Cu eq',
      ],
      grey:  [1850,   0.682,  81.2,  0.00258, 5.14, 0.0418,  0.00450],
      blue:  [ 407,   0.601,  95.8,  0.00212, 5.66, 0.0468,  0.00608],  // <-- REPLACE
      green: [  74,   0.055,  3.25,  0.000129, 4.11, 0.314,  0.04275],  // <-- REPLACE
    },
  },

  // ----------------------------------------------------------
  // LIFE-CYCLE STAGE CONTRIBUTIONS (Single Score in Pt)
  // Each dataset = one process stage; data[0]=Grey, [1]=Blue, [2]=Green
  // Replace with your actual stage contributions.
  // ----------------------------------------------------------
  stages: {
    caseLabels: ['Case A \u2014 Grey', 'Case B \u2014 Blue', 'Case C \u2014 Green'],
    datasets: [
      { label: 'Natural Gas / Feedstock',  data: [0.525, 0.285, 0.000], color: '#9CA3AF' },
      { label: 'Reforming / Electrolysis', data: [0.600, 0.304, 0.200], color: '#60A5FA' },
      { label: 'CCS (Capture & Storage)',  data: [0.000, 0.190, 0.000], color: '#2563EB' },
      { label: 'Renewable Electricity',    data: [0.000, 0.000, 0.092], color: '#34D399' },
      { label: 'Air Separation (ASU)',     data: [0.000, 0.000, 0.032], color: '#6EE7B7' },
      { label: 'Haber-Bosch Synthesis',   data: [0.000, 0.000, 0.048], color: '#059669' },
      { label: 'Utilities (Steam/Power)', data: [0.225, 0.076, 0.000], color: '#FCD34D' },
      { label: 'Transport & Logistics',   data: [0.075, 0.057, 0.012], color: '#D1D5DB' },
      { label: 'Infrastructure / CAPEX',  data: [0.075, 0.038, 0.016], color: '#A78BFA' },
    ],
  },

  // ----------------------------------------------------------
  // SANKEY DIAGRAM — Blue Ammonia Process Flow
  // Values in GJ-equivalent per 1,000 kg NH3
  // ----------------------------------------------------------
  sankey: {
    nodeLabels: [
      'Natural Gas\n(Feedstock)',         // 0
      'Natural Gas\n(Fuel)',              // 1
      'SMR\nReformer',                    // 2
      'Syngas\n(H\u2082 + CO + CO\u2082)', // 3
      'Amine Scrubbing\n(CO\u2082 Removal)', // 4
      'H\u2082\n(Purified)',              // 5
      'CO\u2082\nCaptured',              // 6
      'CCS Pipeline\n& Storage',         // 7
      'Air',                             // 8
      'Air Separation\nUnit (ASU)',       // 9
      'N\u2082\n(Purified)',             // 10
      'Haber\u2013Bosch\nReactor',       // 11
      'NH\u2083 Product\n(1,000 kg)',    // 12
    ],
    nodeColors: [
      '#9CA3AF', '#6B7280',   // NG feed, NG fuel
      '#F97316',               // SMR
      '#FB923C',               // Syngas
      '#3B82F6',               // Amine scrubbing
      '#60A5FA',               // H2
      '#93C5FD',               // CO2 captured
      '#1E3A8A',               // CCS storage
      '#D1D5DB',               // Air
      '#A78BFA',               // ASU
      '#C4B5FD',               // N2
      '#F59E0B',               // Haber-Bosch
      '#22C55E',               // NH3 product
    ],
    // source index, target index, flow value (GJ equiv.)
    links: [
      { source: 0,  target: 2,  value: 55 },   // NG feed → SMR
      { source: 1,  target: 2,  value: 20 },   // NG fuel → SMR
      { source: 2,  target: 3,  value: 65 },   // SMR → syngas
      { source: 3,  target: 4,  value: 65 },   // syngas → amine scrubbing
      { source: 4,  target: 5,  value: 40 },   // scrubbing → H2
      { source: 4,  target: 6,  value: 25 },   // scrubbing → CO2 captured
      { source: 6,  target: 7,  value: 24 },   // CO2 → CCS
      { source: 8,  target: 9,  value: 28 },   // air → ASU
      { source: 9,  target: 10, value: 24 },   // ASU → N2
      { source: 5,  target: 11, value: 40 },   // H2 → Haber-Bosch
      { source: 10, target: 11, value: 24 },   // N2 → Haber-Bosch
      { source: 11, target: 12, value: 50 },   // HB → NH3 product
    ],
  },

};  // end LCA_DATA
