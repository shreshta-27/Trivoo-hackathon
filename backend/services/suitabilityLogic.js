
export const filterSuitableTrees = (trees, env) => {
    const suitable = [];
    const reasons = {};

    trees.forEach(tree => {
        let isMatch = true;
        const rejectReasons = [];

        const rainRange = parseRange(tree.rainfall_mm);
        const tempRange = parseRange(tree.temperature_c);

        if (env.rainfall_mm < rainRange.min || env.rainfall_mm > rainRange.max) {
            const tolerance = 0.1;
            if (env.rainfall_mm < rainRange.min * (1 - tolerance) || env.rainfall_mm > rainRange.max * (1 + tolerance)) {
                isMatch = false;
                rejectReasons.push(`Rainfall ${env.rainfall_mm}mm outside ${tree.rainfall_mm}`);
            }
        }

        if (env.temp_max_c > tempRange.max + 2 || env.temp_min_c < tempRange.min - 2) {
            isMatch = false;
            rejectReasons.push(`Temp ${env.temp_min_c}-${env.temp_max_c}°C outside ${tree.temperature_c}`);
        }

        const soilMatch = tree.soil.some(s => s.toLowerCase().includes(env.soil_type.toLowerCase()) || env.soil_type.toLowerCase().includes(s.toLowerCase()));
        if (!soilMatch) {
            isMatch = false;
            rejectReasons.push(`Soil '${env.soil_type}' not in [${tree.soil.join(', ')}]`);
        }

        if (isMatch) {
            let score = tree.reforestation_score;
            if (tree.maintenance.toLowerCase().includes('low')) score += 1;
            if (tree.growth_speed.toLowerCase().includes('fast')) score += 0.5;

            suitable.push({ ...tree.toObject(), calculated_score: score });
        }
    });

    return suitable.sort((a, b) => b.calculated_score - a.calculated_score);
};

const parseRange = (str) => {
    if (!str) return { min: 0, max: 10000 };
    const parts = str.split('-');
    if (parts.length === 2) {
        return { min: parseInt(parts[0]), max: parseInt(parts[1]) };
    }
    return { min: 0, max: 10000 };
};
