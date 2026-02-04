/**
 * Chart Data Formatter Utility
 * Formats backend data into Chart.js compatible format
 */

/**
 * Format health history data for Chart.js line chart
 * @param {Array} healthHistory - Array of health history records
 * @returns {Object} Chart.js compatible data object
 */
export const formatHealthChartData = (healthHistory) => {
    if (!healthHistory || healthHistory.length === 0) {
        return {
            labels: [],
            datasets: [{
                label: 'Health Score',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4
            }]
        };
    }

    const labels = healthHistory.map(record => {
        const date = new Date(record.recordedAt || record.createdAt);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const data = healthHistory.map(record => record.healthScore || 0);

    return {
        labels,
        datasets: [{
            label: 'Health Score',
            data,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
            fill: true
        }]
    };
};

/**
 * Format risk signals data for Chart.js doughnut chart
 * @param {Array} riskSignals - Array of risk signal records
 * @returns {Object} Chart.js compatible data object
 */
export const formatRiskChartData = (riskSignals) => {
    if (!riskSignals || riskSignals.length === 0) {
        return {
            labels: ['No Risks'],
            datasets: [{
                data: [1],
                backgroundColor: ['rgba(200, 200, 200, 0.6)']
            }]
        };
    }

    const riskCounts = {};
    riskSignals.forEach(signal => {
        const riskType = signal.riskType || 'Unknown';
        riskCounts[riskType] = (riskCounts[riskType] || 0) + 1;
    });

    const labels = Object.keys(riskCounts);
    const data = Object.values(riskCounts);

    const colors = [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)'
    ];

    return {
        labels,
        datasets: [{
            data,
            backgroundColor: colors.slice(0, labels.length),
            borderColor: colors.slice(0, labels.length).map(c => c.replace('0.6', '1')),
            borderWidth: 2
        }]
    };
};

/**
 * Format maintenance actions data for Chart.js bar chart
 * @param {Array} maintenanceActions - Array of maintenance action records
 * @returns {Object} Chart.js compatible data object
 */
export const formatMaintenanceChartData = (maintenanceActions) => {
    if (!maintenanceActions || maintenanceActions.length === 0) {
        return {
            labels: [],
            datasets: [{
                label: 'Maintenance Actions',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.6)'
            }]
        };
    }

    const actionCounts = {};
    maintenanceActions.forEach(action => {
        const month = new Date(action.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        actionCounts[month] = (actionCounts[month] || 0) + 1;
    });

    const labels = Object.keys(actionCounts);
    const data = Object.values(actionCounts);

    return {
        labels,
        datasets: [{
            label: 'Maintenance Actions',
            data,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
        }]
    };
};

/**
 * Format suitability data for Chart.js radar chart
 * @param {Object} suitabilityData - Suitability analysis data
 * @returns {Object} Chart.js compatible data object
 */
export const formatSuitabilityChartData = (suitabilityData) => {
    if (!suitabilityData) {
        return {
            labels: [],
            datasets: [{
                label: 'Suitability',
                data: []
            }]
        };
    }

    const labels = ['Soil', 'Climate', 'Water', 'Terrain', 'Accessibility'];
    const data = [
        suitabilityData.soilScore || 0,
        suitabilityData.climateScore || 0,
        suitabilityData.waterScore || 0,
        suitabilityData.terrainScore || 0,
        suitabilityData.accessibilityScore || 0
    ];

    return {
        labels,
        datasets: [{
            label: 'Suitability Score',
            data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(255, 99, 132, 1)'
        }]
    };
};

/**
 * Format project statistics for Chart.js bar chart
 * @param {Array} projects - Array of project records
 * @returns {Object} Chart.js compatible data object
 */
export const formatProjectStatsChartData = (projects) => {
    if (!projects || projects.length === 0) {
        return {
            labels: [],
            datasets: [{
                label: 'Health Score',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        };
    }

    const labels = projects.map(p => p.name || 'Unnamed Project');
    const healthScores = projects.map(p => p.healthScore || 0);
    const plantationSizes = projects.map(p => p.plantationSize || 0);

    return {
        labels,
        datasets: [
            {
                label: 'Health Score',
                data: healthScores,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                yAxisID: 'y'
            },
            {
                label: 'Plantation Size (trees)',
                data: plantationSizes,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                yAxisID: 'y1'
            }
        ]
    };
};

/**
 * Format environmental data for Chart.js mixed chart
 * @param {Object} environmentalData - Environmental data object
 * @returns {Object} Chart.js compatible data object
 */
export const formatEnvironmentalChartData = (environmentalData) => {
    if (!environmentalData) {
        return {
            labels: [],
            datasets: []
        };
    }

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const temperatureData = environmentalData.monthlyTemperature || Array(12).fill(0);
    const rainfallData = environmentalData.monthlyRainfall || Array(12).fill(0);

    return {
        labels,
        datasets: [
            {
                type: 'line',
                label: 'Temperature (°C)',
                data: temperatureData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                yAxisID: 'y',
                tension: 0.4
            },
            {
                type: 'bar',
                label: 'Rainfall (mm)',
                data: rainfallData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                yAxisID: 'y1'
            }
        ]
    };
};

export default {
    formatHealthChartData,
    formatRiskChartData,
    formatMaintenanceChartData,
    formatSuitabilityChartData,
    formatProjectStatsChartData,
    formatEnvironmentalChartData
};
