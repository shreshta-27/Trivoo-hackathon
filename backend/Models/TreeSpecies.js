import mongoose from 'mongoose';

const treeSpeciesSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    rainfall_mm: { type: String, required: true },
    temperature_c: { type: String, required: true },
    soil: [{ type: String }],
    water_need: { type: String },
    growth_speed: { type: String },
    maintenance: { type: String },
    reforestation_score: { type: Number }
});

const TreeSpecies = mongoose.model('TreeSpecies', treeSpeciesSchema);
export default TreeSpecies;
