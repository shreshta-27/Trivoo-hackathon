/**
 * Risk Calculator Utility
 * Deterministic risk calculation logic for projects and regions
 * No AI involved - pure algorithmic decision making
 */

/**
 * Calculate project risk level based on health score
 * @param {number} healthScore - Health score (0-100)
 * @returns {string} Risk level
 */
export const calculateProjectRisk = (healthScore) => {
    if (healthScore > 75) {
        return 'stable';
    } else if (healthScore >= 50 && healthScore <= 75) {
        return 'medium_stress';
    } else if (healthScore >= 25 && healthScore < 50) {
        return 'high_stress';
    } else {
        return 'critical_stress';
    }
};

/**
 * Aggregate region risk from multiple projects
 * Region risk = highest risk among its projects (intentional design)
 * @param {Array} projects - Array of project objects with riskLevel
 * @returns {string} Aggregated risk level
 */
export const aggregateRegionRisk = (projects) => {
    if (!projects || projects.length === 0) {
        return 'stable';
    }

    const riskPriority = {
        'critical_stress': 4,
        'high_stress': 3,
        'medium_stress': 2,
        'stable': 1
    };

    let highestRisk = 'stable';
    let highestPriority = 0;

    for (const project of projects) {
        const projectRisk = project.riskLevel || 'stable';
        const priority = riskPriority[projectRisk] || 0;

        if (priority > highestPriority) {
            highestPriority = priority;
            highestRisk = projectRisk;
        }
    }

    return highestRisk;
};

/**
 * Get color code for risk level (for map visualization)
 * @param {string} riskLevel - Risk level
 * @returns {string} Hex color code
 */
export const getRiskColor = (riskLevel) => {
    const colorMap = {
        'stable': '#10B981',        // Green
        'medium_stress': '#F59E0B', // Amber
        'high_stress': '#EF4444',   // Red
        'critical_stress': '#7F1D1D' // Dark Red
    };

    return colorMap[riskLevel] || '#6B7280'; // Gray as fallback
};

/**
 * Get risk description for UI display
 * @param {string} riskLevel - Risk level
 * @returns {string} Human-readable description
 */
export const getRiskDescription = (riskLevel) => {
    const descriptions = {
        'stable': 'Healthy and thriving',
        'medium_stress': 'Moderate stress detected',
        'high_stress': 'High stress - immediate attention needed',
        'critical_stress': 'Critical condition - urgent intervention required'
    };

    return descriptions[riskLevel] || 'Unknown status';
};

/**
 * Calculate risk score (0-100) from health score
 * Inverse relationship: lower health = higher risk
 * @param {number} healthScore - Health score (0-100)
 * @returns {number} Risk score (0-100)
 */
export const calculateRiskScore = (healthScore) => {
    return 100 - healthScore;
};

/**
 * Determine if a project needs immediate intervention
 * @param {string} riskLevel - Risk level
 * @returns {boolean} True if intervention needed
 */
export const needsIntervention = (riskLevel) => {
    return riskLevel === 'high_stress' || riskLevel === 'critical_stress';
};

/**
 * Get recommended action based on risk level
 * @param {string} riskLevel - Risk level
 * @returns {string} Recommended action
 */
export const getRecommendedAction = (riskLevel) => {
    const actions = {
        'stable': 'Continue regular monitoring',
        'medium_stress': 'Increase monitoring frequency and assess environmental factors',
        'high_stress': 'Deploy field team for immediate assessment and intervention',
        'critical_stress': 'Emergency response required - mobilize all resources'
    };

    return actions[riskLevel] || 'Assess current status';
};

export default {
    calculateProjectRisk,
    aggregateRegionRisk,
    getRiskColor,
    getRiskDescription,
    calculateRiskScore,
    needsIntervention,
    getRecommendedAction
};
