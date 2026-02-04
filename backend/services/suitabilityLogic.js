
export const filterSuitableTrees = (trees, env) => {
    const suitable = [];
    const reasons = {};

    trees.forEach(tree => {
        let isMatch = true;
        const rejectReasons = [];

        // 1. Parsing Ranges
        const rainRange = parseRange(tree.rainfall_mm);
        const tempRange = parseRange(tree.temperature_c);

        // 2. Rainfall Check
        // If Env.Rainfall is within or close to tree range
        if (env.rainfall_mm < rainRange.min || env.rainfall_mm > rainRange.max) {
            // Allow 10% tolerance?
            const tolerance = 0.1;
            if (env.rainfall_mm < rainRange.min * (1 - tolerance) || env.rainfall_mm > rainRange.max * (1 + tolerance)) {
                isMatch = false;
                rejectReasons.push(`Rainfall ${env.rainfall_mm}mm outside ${tree.rainfall_mm}`);
            }
        }

        // 3. Temperature Check
        // Tree temp range usually means "can survive in". 
        // We check if Env Avg Min/Max are roughly sustainable.
        // Env: min 20, max 35. Tree: 15-35. 
        // If Env.Max > Tree.Max (too hot)? 
        // If Env.Min < Tree.Min (too cold)?
        if (env.temp_max_c > tempRange.max + 2 || env.temp_min_c < tempRange.min - 2) {
            isMatch = false;
            rejectReasons.push(`Temp ${env.temp_min_c}-${env.temp_max_c}°C outside ${tree.temperature_c}`);
        }

        // 4. Soil Check
        // Env.soil = "Loamy". Tree.soil = ["Loamy", "Sandy"]
        // We assume partial match is enough.
        // Also map synonyms if needed, but simple string includes for now.
        const soilMatch = tree.soil.some(s => s.toLowerCase().includes(env.soil_type.toLowerCase()) || env.soil_type.toLowerCase().includes(s.toLowerCase()));
        if (!soilMatch) {
            isMatch = false;
            rejectReasons.push(`Soil '${env.soil_type}' not in [${tree.soil.join(', ')}]`);
        }

        if (isMatch) {
            // Calculate Score
            // Base: reforestation_score (1-5)
            // Bonus: maintenance 'Low' = +1
            let score = tree.reforestation_score;
            if (tree.maintenance.toLowerCase().includes('low')) score += 1;
            if (tree.growth_speed.toLowerCase().includes('fast')) score += 0.5;

            suitable.push({ ...tree.toObject(), calculated_score: score });
        }
    });

    // Sort by Score Descending
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
