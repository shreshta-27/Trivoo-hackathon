import TreeSpecies from '../Models/TreeSpecies.js';

const treeData = [
    { "name": "Bamboo", "rainfall_mm": "1200-2500", "temperature_c": "15-35", "soil": ["Loamy", "Sandy"], "water_need": "Medium", "growth_speed": "Very Fast", "maintenance": "Low", "reforestation_score": 5 },
    { "name": "Neem", "rainfall_mm": "400-1200", "temperature_c": "20-40", "soil": ["Sandy", "Loamy"], "water_need": "Low", "growth_speed": "Medium", "maintenance": "Very Low", "reforestation_score": 5 },
    { "name": "Teak", "rainfall_mm": "1000-2000", "temperature_c": "22-38", "soil": ["Loamy", "Well-drained"], "water_need": "Medium", "growth_speed": "Medium", "maintenance": "Medium", "reforestation_score": 4 },
    { "name": "Sal", "rainfall_mm": "1200-2500", "temperature_c": "20-35", "soil": ["Clayey", "Loamy"], "water_need": "Medium", "growth_speed": "Slow", "maintenance": "Medium", "reforestation_score": 4 },
    { "name": "Jamun", "rainfall_mm": "900-1800", "temperature_c": "20-38", "soil": ["Loamy", "Alluvial"], "water_need": "Medium", "growth_speed": "Medium", "maintenance": "Low", "reforestation_score": 4 },
    { "name": "Arjun", "rainfall_mm": "800-1500", "temperature_c": "18-35", "soil": ["Sandy", "Riverine"], "water_need": "Medium", "growth_speed": "Medium", "maintenance": "Low", "reforestation_score": 4 },
    { "name": "Mahua", "rainfall_mm": "700-1600", "temperature_c": "20-40", "soil": ["Sandy", "Loamy"], "water_need": "Medium", "growth_speed": "Slow", "maintenance": "Medium", "reforestation_score": 3 },
    { "name": "Mango", "rainfall_mm": "700-1200", "temperature_c": "24-40", "soil": ["Loamy"], "water_need": "Medium-High", "growth_speed": "Medium", "maintenance": "High", "reforestation_score": 3 },
    { "name": "Peepal", "rainfall_mm": "600-1500", "temperature_c": "20-40", "soil": ["Loamy", "Rocky"], "water_need": "Low", "growth_speed": "Slow", "maintenance": "Very Low", "reforestation_score": 2 },
    { "name": "Banyan", "rainfall_mm": "600-1500", "temperature_c": "20-40", "soil": ["Loamy"], "water_need": "Medium", "growth_speed": "Slow", "maintenance": "Low", "reforestation_score": 2 }
];

export const seedTreeData = async () => {
    try {
        const count = await TreeSpecies.countDocuments();
        if (count === 0) {
            await TreeSpecies.insertMany(treeData);
            console.log('Tree data seeded');
        }
    } catch (error) {
        console.error('Tree seeding failed', error);
    }
};
