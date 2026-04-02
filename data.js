/**
 * ESG Dashboard – Sample Data
 * Based on bcgov/esg-dashboard (Apache 2.0)
 * Indicative values representative of Natural Resources Canada &
 * Statistics Canada published data.
 */

// ---- Environmental Data ----

const ENV_YEARS = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];

const INDUSTRIES = [
  "Manufacturing",
  "Mining, Oil & Gas",
  "Forestry",
  "Construction"
];

// Energy use per employee (GJ/employee)
const energyByIndustry = {
  "Manufacturing":      [310, 308, 302, 298, 295, 293, 290, 278, 282, 288],
  "Mining, Oil & Gas":  [720, 735, 748, 760, 755, 762, 770, 745, 752, 768],
  "Forestry":           [480, 475, 470, 465, 462, 458, 455, 440, 448, 455],
  "Construction":       [120, 122, 118, 115, 117, 119, 121, 110, 114, 118]
};

// GHG emissions per employee (tCO₂e/employee)
const ghgByIndustry = {
  "Manufacturing":      [21.2, 20.8, 20.1, 19.6, 19.2, 18.9, 18.5, 17.8, 18.1, 18.6],
  "Mining, Oil & Gas":  [54.1, 55.3, 56.0, 57.2, 56.8, 57.5, 58.1, 55.9, 56.5, 57.8],
  "Forestry":           [30.2, 29.8, 29.3, 28.9, 28.5, 28.1, 27.8, 26.9, 27.4, 27.9],
  "Construction":       [ 8.1,  8.2,  8.0,  7.8,  7.9,  8.0,  8.1,  7.5,  7.7,  7.9]
};

// Energy share by source (%) — latest year snapshot
const energySources = [
  "Electricity",
  "Natural Gas",
  "Diesel / Light Fuel Oil",
  "Heavy Fuel Oil",
  "Coal",
  "Wood Waste / Pulping Liquor",
  "Other"
];

const energySourceShares = [22, 28, 18, 7, 6, 12, 7];

// Flat table rows for CSV / table display
const envTableData = [];
INDUSTRIES.forEach(ind => {
  ENV_YEARS.forEach((yr, i) => {
    envTableData.push({
      industry: ind,
      year: yr,
      energy: energyByIndustry[ind][i],
      ghg: ghgByIndustry[ind][i],
      region: "British Columbia"
    });
  });
});


// ---- Social Data ----

const SOC_YEARS = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];

// Employment by age group (% of total workforce)
const employmentAge = {
  "15–24 years":    [14.2, 13.8, 13.5, 13.1, 12.9, 12.6, 12.3, 11.8, 12.1, 12.4],
  "25–54 years":    [62.5, 62.0, 61.8, 61.5, 61.2, 61.0, 60.7, 60.3, 60.5, 60.8],
  "55 years and +": [23.3, 24.2, 24.7, 25.4, 25.9, 26.4, 27.0, 27.9, 27.4, 26.8]
};

// Mean weekly overtime hours
const overtimeGender = {
  "Men+":   [3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.2, 3.5, 3.8, 4.0],
  "Women+": [1.9, 1.9, 2.0, 2.1, 2.1, 2.2, 2.2, 1.8, 1.9, 2.1]
};

// Representation of women by wage level (%)
const wageRepLabels = [
  "< $12/hr",
  "$12–$19.99/hr",
  "$20–$29.99/hr",
  "$30+/hr",
  "Total"
];

const wageRepData = [58, 49, 42, 35, 47];   // % women at each wage band

// Work absences by gender (days/year)
const workAbsence = {
  "Men+ (no children)":    [7.2, 7.1, 7.0, 6.9, 6.8, 6.7, 6.6, 8.1, 7.5, 7.2],
  "Men+ (with children)":  [6.9, 6.8, 6.7, 6.6, 6.5, 6.4, 6.3, 7.8, 7.2, 6.9],
  "Women+ (no children)":  [9.5, 9.4, 9.3, 9.2, 9.0, 8.9, 8.8, 10.5, 9.8, 9.4],
  "Women+ (with children)":[11.2,11.0,10.8,10.6,10.4,10.2,10.0,12.1,11.3,10.9]
};

// Social table rows
const socTableData = [];

Object.entries(employmentAge).forEach(([grp, vals]) => {
  SOC_YEARS.forEach((yr, i) => {
    socTableData.push({ metric: "Employment by age group", group: grp, year: yr, value: vals[i], unit: "%" });
  });
});

Object.entries(overtimeGender).forEach(([grp, vals]) => {
  SOC_YEARS.forEach((yr, i) => {
    socTableData.push({ metric: "Mean weekly overtime hours", group: grp, year: yr, value: vals[i], unit: "hrs/week" });
  });
});

wageRepLabels.forEach((lbl, i) => {
  socTableData.push({ metric: "Women by wage level", group: lbl, year: 2022, value: wageRepData[i], unit: "%" });
});
